import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const { productId, type } = body;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const cartItem = await prisma.cartItem.findFirst({
    where: { userId: user.id, productId },
  });

  if (!cartItem) {
    return new Response(JSON.stringify({ error: "Ürün sepette yok" }), { status: 404 });
  }

  if (type === "increase") {
    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: { increment: 1 } },
    });
  } else if (type === "decrease") {
    if (cartItem.quantity > 1) {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: { decrement: 1 } },
      });
    } else {
      // Eğer 1'e eşitse ve azaltılırsa tamamen sil
      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    }
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
