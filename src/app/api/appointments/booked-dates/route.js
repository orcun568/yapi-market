// src/app/api/appointments/booked-dates/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      select: {
        appointmentDate: true,
      },
    });

    // Tarihleri sadece YYYY-MM-DD formatında dönebiliriz:
    const dates = appointments.map(({ appointmentDate }) => 
      appointmentDate.toISOString().split('T')[0]
    );

    // Tekrarlayan tarihleri engelle
    const uniqueDates = [...new Set(dates)];

    return NextResponse.json(uniqueDates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Randevulu günler alınamadı.' }, { status: 500 });
  }
}
