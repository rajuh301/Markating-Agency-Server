-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeExpiry" TIMESTAMP(3),
ADD COLUMN     "verificationCode" TEXT;
