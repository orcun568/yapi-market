/*
  Warnings:

  - You are about to drop the `ResetToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_userId_fkey";

-- DropTable
DROP TABLE "ResetToken";
