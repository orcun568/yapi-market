// app/api/categories/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Kategoriler alınamadı:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Kategori adı gerekli." }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Kategori eklenemedi:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}

