/*
  Warnings:

  - Added the required column `title1` to the `Slider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title2` to the `Slider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title3` to the `Slider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Slider" ADD COLUMN     "title1" TEXT NOT NULL,
ADD COLUMN     "title2" TEXT NOT NULL,
ADD COLUMN     "title3" TEXT NOT NULL;
