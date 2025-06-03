-- CreateTable
CREATE TABLE "PaintColor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PaintColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaintAppointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "roomCount" INTEGER NOT NULL,
    "paintType" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "paintColorId" INTEGER NOT NULL,

    CONSTRAINT "PaintAppointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaintAppointment" ADD CONSTRAINT "PaintAppointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaintAppointment" ADD CONSTRAINT "PaintAppointment_paintColorId_fkey" FOREIGN KEY ("paintColorId") REFERENCES "PaintColor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
