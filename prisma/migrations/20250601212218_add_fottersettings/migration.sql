-- CreateTable
CREATE TABLE "FooterSetting" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "instagramUrl" TEXT NOT NULL,
    "facebookUrl" TEXT NOT NULL,
    "xUrl" TEXT NOT NULL,

    CONSTRAINT "FooterSetting_pkey" PRIMARY KEY ("id")
);
