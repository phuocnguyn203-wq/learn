import { createHash, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/app-error.js";
import { AuthRepository, UserRepository } from "../repositories/repository.types.js";

type PasswordHasher = { compare(pw: string, hash: string): Promise<boolean> }

// Refresh token đã đủ ngẫu nhiên nên sha256 là đủ, và cùng input luôn ra cùng hash → findByHash được
// (bcrypt mỗi lần ra một hash khác nên không tìm theo hash được)
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export default class AuthService {
  userRepo: UserRepository
  authRepo: AuthRepository
  hasher: PasswordHasher
  jwtSecret: string
  constructor(userRepo: UserRepository, authRepo: AuthRepository, hasher: PasswordHasher, jwtSecret: string) {
    this.userRepo = userRepo
    this.authRepo = authRepo
    this.hasher = hasher
    this.jwtSecret = jwtSecret
  }

  // Access token = JWT, tự kiểm tra bằng chữ ký, không cần hỏi DB
  signAccessToken(userId: number) {
    return jwt.sign({ sub: String(userId) }, this.jwtSecret, { expiresIn: "15m" })
  }

  // Refresh token = chuỗi ngẫu nhiên; client giữ bản gốc, DB chỉ giữ hash
  newRefreshToken() {
    const raw = randomBytes(32).toString("hex")
    return { raw, hash: sha256(raw) }
  }

  async login(email: string, pw: string) {
    const user = await this.userRepo.findByEmail(email)
    // Sai email hay sai mật khẩu đều cùng một lỗi → không lộ email nào đã đăng ký
    if (user === null || !(await this.hasher.compare(pw, user.hashedPassword))) {
      throw new UnauthorizedError("invalid email or password")
    }
    const refresh = this.newRefreshToken()
    await this.authRepo.create(user.id, refresh.hash)
    return { accessToken: this.signAccessToken(user.id), refreshToken: refresh.raw }
  }

  async refresh(rawToken: string) {
    const token = await this.authRepo.findByHash(sha256(rawToken))
    if (token === null || new Date(token.expiresAt) <= new Date()) {
      throw new UnauthorizedError("invalid refresh token")
    }
    // Token đã thu hồi mà vẫn bị gửi lên → có thể bị đánh cắp → đăng xuất mọi thiết bị
    if (token.revokedAt !== null) {
      await this.authRepo.revokeAllByUser(token.userId)
      throw new UnauthorizedError("refresh token reused")
    }
    const refresh = this.newRefreshToken()
    const rotated = await this.authRepo.rotate(token.id, token.userId, refresh.hash)
    if (rotated === null) {
      await this.authRepo.revokeAllByUser(token.userId)
      throw new UnauthorizedError("refresh token reused")
    }
    return { accessToken: this.signAccessToken(token.userId), refreshToken: refresh.raw }
  }

  async logout(rawToken: string) {
    const token = await this.authRepo.findByHash(sha256(rawToken))
    if (token !== null) { await this.authRepo.revoke(token.id) }
  }
}
