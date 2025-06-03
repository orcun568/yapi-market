/*
  Warnings:

  - You are about to drop the `PaintAppointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaintAppointment" DROP CONSTRAINT "PaintAppointment_paintColorId_fkey";

-- DropForeignKey
ALTER TABLE "PaintAppointment" DROP CONSTRAINT "PaintAppointment_userId_fkey";

-- DropTable
DROP TABLE "PaintAppointment";

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "roomCount" INTEGER NOT NULL,
    "paintColorId" INTEGER NOT NULL,
    "paintType" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_paintColorId_fkey" FOREIGN KEY ("paintColorId") REFERENCES "PaintColor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
