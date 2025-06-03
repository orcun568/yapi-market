import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const { productId } = body;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const existing = await prisma.cartItem.findFirst({
    where: { userId: user.id, productId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId,
        quantity: 1,
      },
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
