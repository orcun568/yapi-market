import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: "Giriş yapılmamış" }), { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Kullanıcı bulunamadı" }), { status: 404 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return new Response(JSON.stringify({ success: true, message: "Sepet temizlendi" }), { status: 200 });

  } catch (error) {
    console.error("Sepeti temizleme hatası:", error);
    return new Response(JSON.stringify({ error: "Sepeti temizlerken hata oluştu" }), { status: 500 });
  }
}
