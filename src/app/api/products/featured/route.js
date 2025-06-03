import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      include: { category: true },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Öne çıkan ürünler alınırken hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
