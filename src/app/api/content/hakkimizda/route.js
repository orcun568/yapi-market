import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

export async function GET() {
  // Varsayalım tek bir satır var. Yoksa default boş objeyle döner.
  const content = await prisma.content.findFirst();

  return NextResponse.json(content || {
    hakkimizda: "",
    telefon: "",
    email: "",
    calismaSaatleri: "",
    konumAdres: "",
    haritaUrl: ""
  });
}

export async function POST(request) {
  const data = await request.json();

  try {
    const existing = await prisma.content.findFirst();

    if (existing) {
      // Güncelle
      await prisma.content.update({
        where: { id: existing.id },
        data,
      });
    } else {
      // Oluştur
      await prisma.content.create({ data });
    }
    return NextResponse.json({ message: "Başarıyla kaydedildi." });
  } catch (error) {
    return NextResponse.json({ message: "Kaydetme hatası", error }, { status: 500 });
  }
}
