/*
  Warnings:

  - You are about to drop the `SiteSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SiteSettings";

-- CreateTable
CREATE TABLE "FooterSettings" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "twitter" TEXT NOT NULL,

    CONSTRAINT "FooterSettings_pkey" PRIMARY KEY ("id")
);
