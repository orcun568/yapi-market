import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: "Giriş yapılmamış" }), { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Kullanıcı bulunamadı" }), { status: 404 });
    }

    const deleted = await prisma.cartItem.deleteMany({
      where: {
        userId: user.id,
        productId: Number(productId),
      },
    });

    return new Response(JSON.stringify({ success: true, deleted }), { status: 200 });

  } catch (error) {
    console.error("Silme hatası:", error);
    return new Response(JSON.stringify({ error: "Silme işlemi başarısız" }), { status: 500 });
  }
}
