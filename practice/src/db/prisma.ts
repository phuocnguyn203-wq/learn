import { PrismaClient } from "../../generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"

export function createPrisma() {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    log: ["query"]
  })
}