/*
  Warnings:

  - You are about to drop the `FooterSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "FooterSetting";

-- CreateTable
CREATE TABLE "FoooterSetting" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "instagramUrl" TEXT NOT NULL,
    "facebookUrl" TEXT NOT NULL,
    "xUrl" TEXT NOT NULL,

    CONSTRAINT "FoooterSetting_pkey" PRIMARY KEY ("id")
);
