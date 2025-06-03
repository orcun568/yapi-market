/*
  Warnings:

  - A unique constraint covering the columns `[hexCode]` on the table `PaintColor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hexCode` to the `PaintColor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaintColor" ADD COLUMN     "hexCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaintColor_hexCode_key" ON "PaintColor"("hexCode");
