import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: "Yetkisiz" }), {
        status: 401,
      });
    }

    const body = await req.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return new Response(JSON.stringify({ error: "Telefon numarası gerekli" }), {
        status: 400,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { phoneNumber },
    });

    return new Response(JSON.stringify({ success: true, user: updatedUser }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
