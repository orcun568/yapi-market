import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const sort = searchParams.get("sort");

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId: parseInt(categoryId) } : undefined,
      include: { category: true },
      orderBy: sort
        ? sort === "priceAsc"
          ? { price: "asc" }
          : sort === "priceDesc"
          ? { price: "desc" }
          : undefined
        : undefined,
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET Hatası:", error);
    return NextResponse.json({ error: "Ürünler alınamadı." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      price,
      stock,
      categoryId,
      description,
      image,
      isFeatured, // ✅ Yeni alan
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        price: parseInt(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        description,
        image,
        isFeatured: Boolean(isFeatured), // ✅ Yeni alan
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST Hatası:", error);
    return NextResponse.json({ error: "Ürün eklenemedi." }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      price,
      stock,
      categoryId,
      description,
      image,
      isFeatured, // ✅ Yeni alan
    } = body;

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseInt(price),
        stock: parseInt(stock),
        categoryId: parseInt(categoryId),
        description,
        image,
        isFeatured: Boolean(isFeatured), // ✅ Yeni alan
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Hatası:", error);
    return NextResponse.json({ error: "Ürün güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Ürün silindi." }, { status: 200 });
  } catch (error) {
    console.error("DELETE Hatası:", error);
    return NextResponse.json({ error: "Ürün silinemedi." }, { status: 500 });
  }
}
