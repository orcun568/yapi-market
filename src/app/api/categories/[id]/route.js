import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// DELETE: Kategori silme
export async function DELETE(request, { params }) {
  const id = Number(params.id);
  try {
    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Kategori silindi" });
  } catch (error) {
    console.error("Silme hatası:", error);
    return NextResponse.json({ error: "Silinemedi" }, { status: 500 });
  }
}

// PUT: Kategori güncelleme
export async function PUT(request, { params }) {
  const id = Number(params.id);
  const body = await request.json();
  const { name } = body;

  try {
    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return NextResponse.json({ error: "Güncellenemedi" }, { status: 500 });
  }
}
