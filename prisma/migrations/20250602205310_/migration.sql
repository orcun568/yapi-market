-- CreateTable
CREATE TABLE "AboutPage" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mapEmbed" TEXT NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);
