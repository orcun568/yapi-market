-- CreateTable
CREATE TABLE "AboutInfo" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "locationUrl" TEXT NOT NULL,
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutInfo_pkey" PRIMARY KEY ("id")
);
