-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "expires_at" SET DEFAULT (NOW() + INTERVAL '7 days');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';
