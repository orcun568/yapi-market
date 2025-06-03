import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const slider = await prisma.slider.findFirst();
  return NextResponse.json(slider || {});
}

export async function POST(request) {
  const data = await request.json();

  const existing = await prisma.slider.findFirst();

  if (!existing) {
    await prisma.slider.create({ data });
  } else {
    await prisma.slider.update({
      where: { id: existing.id },
      data,
    });
  }

  return NextResponse.json({ message: "Slider güncellendi" });
}
