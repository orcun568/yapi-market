-- CreateTable
CREATE TABLE "SiteInfo" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,

    CONSTRAINT "SiteInfo_pkey" PRIMARY KEY ("id")
);
