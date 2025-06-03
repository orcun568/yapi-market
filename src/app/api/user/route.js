import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; 
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,           // modelindeki isim neyse ona göre değiştir
        email: true,
        phoneNumber: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Kullanıcı API hatası:", error);
    return NextResponse.json(
      { error: "Kullanıcı bilgileri alınamadı", detail: error.message },
      { status: 500 }
    );
  }
}
