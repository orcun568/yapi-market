/*
  Warnings:

  - You are about to drop the `SiteInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SiteInfo";

-- CreateTable
CREATE TABLE "AboutPage" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mapEmbedUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);
