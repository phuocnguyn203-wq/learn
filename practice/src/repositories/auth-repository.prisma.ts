import { PrismaClient, RefreshToken } from "../../generated/prisma/client.js";
import { AuthRepository } from "./repository.types.js";

function toToken<T extends RefreshToken>(token: T) {
  return {
    ...token,
    expiresAt: token.expiresAt.toISOString(),
    revokedAt: token.revokedAt? token.revokedAt.toISOString() : null
  }
}
export class AuthPrismaRepository implements AuthRepository {
  client: PrismaClient
  constructor(client: PrismaClient) {
    this.client = client;
  }

  async create(userId: number, tokenHash: string) {
    const refreToken = await this.client.refreshToken.create({
      data: { userId, tokenHash }
    })
    return toToken(refreToken)
  }

  async findByHash(tokenHash: string) {
    const refreToken = await this.client.refreshToken.findUnique({
      where: { tokenHash }
    })
    return refreToken ? toToken(refreToken) : null
  }

  async rotate(oldId: number, userId: number, newHash: string) {
    return this.client.$transaction(async (tx) => {
      // revokedAt: null → 2 request refresh cùng lúc thì chỉ 1 cái thắng
      const { count } = await tx.refreshToken.updateMany({
        where: { id: oldId, revokedAt: null },
        data: { revokedAt: new Date() }
      })
      if (count === 0) { return null; }

      const refreToken = await tx.refreshToken.create({
        data: { userId, tokenHash: newHash }
      })
      return toToken(refreToken)
    })
  }

  async revoke(id: number) {
    await this.client.$executeRaw`
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE id = ${id}
    `
  }

  async revokeAllByUser(userId: number) {
    await this.client.$executeRaw`
      UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE user_id = ${userId}
    `
  }
}