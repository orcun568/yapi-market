-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "hakkimizda" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "calismaSaatleri" TEXT NOT NULL,
    "konumAdres" TEXT NOT NULL,
    "haritaUrl" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);
