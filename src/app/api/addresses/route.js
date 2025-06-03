import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Kullanıcının adreslerini getir
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json({ error: "Adresler alınamadı." }, { status: 500 });
  }
}


// POST: Yeni adres oluştur
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      label,
      fullName,
      phoneNumber,
      city,
      district,
      openAddress,
      postalCode,
    } = body;

    if (!fullName || !city || !district || !openAddress) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const newAddress = await prisma.address.create({
      data: {
        label,
        fullName,
        phoneNumber,
        city,
        district,
        openAddress,
        postalCode,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error("Adres eklerken hata:", error);
    return NextResponse.json({ error: "Adres eklenemedi." }, { status: 500 });
  }
}

// PUT: Adres güncelle
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      label,
      fullName,
      phoneNumber,
      city,
      district,
      openAddress,
      postalCode,
    } = body;

    if (!id || !fullName || !city || !district || !openAddress) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== session.user.id) {
      return NextResponse.json({ error: "Bu adrese erişim izniniz yok." }, { status: 403 });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        label,
        fullName,
        phoneNumber,
        city,
        district,
        openAddress,
        postalCode,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    return NextResponse.json({ error: "Adres güncellenemedi." }, { status: 500 });
  }
}

// DELETE: Adres sil
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Adres ID gerekli." }, { status: 400 });
    }

    // Kullanıcının kendi adresi mi kontrol et
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ error: "Adres bulunamadı veya yetkisiz." }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ message: "Adres silindi." });
  } catch (error) {
    return NextResponse.json({ error: "Adres silinemedi." }, { status: 500 });
  }
}
