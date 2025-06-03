// src/app/api/appointment/route.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options"; // Auth ayarlarının yolu
import prisma from "@/lib/prisma"; // prisma client dosyanın yolu
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const data = await req.json();

    if (
      !data.fullName ||
      !data.email ||
      !data.phoneNumber ||
      !data.addressId ||
      !data.paintAreaDescription ||
      !data.paintColorId ||
      !data.paintType ||
      !data.appointmentDate
    ) {
      return NextResponse.json({ error: "Eksik alanlar var" }, { status: 400 });
    }

    const selectedDate = new Date(data.appointmentDate);

    // ✅ Aynı tarihe randevu var mı kontrolü (tüm kullanıcılar için)
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        appointmentDate: {
          gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
          lt: new Date(selectedDate.setHours(24, 0, 0, 0)),
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "Seçilen tarihte zaten bir randevu bulunmaktadır." },
        { status: 400 }
      );
    }

    await prisma.appointment.create({
      data: {
        userId: session.user.id,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        paintAreaDescription: data.paintAreaDescription,
        paintColorId: parseInt(data.paintColorId),
        paintType: data.paintType,
        appointmentDate: new Date(data.appointmentDate),
        address: data.address,
      },
    });

    return NextResponse.json({ message: "Randevu başarıyla oluşturuldu." });
  } catch (error) {
    console.error("Appointment error:", error);
    return NextResponse.json({ error: "Randevu oluşturulamadı." }, { status: 500 });
  }
}


// src/app/api/appointment/route.js

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        paintColor: true, // Eğer renk ilişkili tabloysa
      },
      orderBy: {
        appointmentDate: "desc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Get Appointments Error:", error);
    return NextResponse.json({ error: "Randevular alınamadı." }, { status: 500 });
  }
}
