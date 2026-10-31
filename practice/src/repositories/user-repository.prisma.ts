import { PrismaClient, User } from "../../generated/prisma/client.js";
import { UserRepository } from "./repository.types.js";

function toUser<T extends User>(user: T) {
  return { ...user, createdAt: user.createdAt.toISOString() }
}

export class UserPrismaRepository implements UserRepository {
  client: PrismaClient
  constructor(client: PrismaClient) {
    this.client = client
  }

  async create(email: string, name: string, hashedPassword: string) {
    const user = await this.client.user.create({
      data: {
        email, hashedPassword, name
      }
    })

    return toUser(user)
  }

  async findByEmail(email: string) {
    const user = await this.client.user.findUnique({
      where: {email}
    })

    return user ? toUser(user) : null
  }

  async findById(id: number) {
    const user = await this.client.user.findUnique({
      where: { id }
    })

    return user ? toUser(user) : null
  }
}