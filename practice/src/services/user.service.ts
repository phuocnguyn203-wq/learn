import { ConflictError, NotFoundError, UnauthorizedError } from "../errors/app-error.js";
import { UserRepository } from "../repositories/repository.types.js";
import type { UserRow } from "../repositories/repository.types.js";
function toSafeUser(user: UserRow) {
  const { hashedPassword, ...safeUser } = user
  return safeUser
}

type HashGenerator = {
  hash(pw: string): Promise<string>,
  compare(pw: string, hash: string): Promise<boolean>
}

export default class UserService {
  userRepo: UserRepository
  hashGenerator: HashGenerator
  constructor(userRepo: UserRepository, hashGenerator: HashGenerator) {
    this.userRepo = userRepo
    this.hashGenerator = hashGenerator
  }

  async getById(id: number) {
    const user = await this.userRepo.findById(id)
    if (user == null) {
      throw new NotFoundError("user not found");
    }

    return toSafeUser(user)
  }

  async getByEmail(email: string) {
    const user = await this.userRepo.findByEmail(email)
    if (user == null) {
      throw new UnauthorizedError()
    }

    return toSafeUser(user);
  }

  async create(email: string, name: string, pw: string) {
    const isExist = await this.userRepo.findByEmail(email)
    if (isExist != null) { throw new ConflictError("email already exists") }
    const user = await this.userRepo.create(email, name, await this.hashGenerator.hash(pw))
    
    return toSafeUser(user)
  }
}