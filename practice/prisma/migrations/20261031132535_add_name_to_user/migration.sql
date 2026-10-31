-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "expires_at" SET DEFAULT (NOW() + INTERVAL '7 days');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '';
