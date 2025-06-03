import prisma from "@/lib/prisma"; // prisma client importun

export async function PATCH(req, { params }) {
  const { id } = params;
  const { status } = await req.json();

  if (!status) {
    return new Response(JSON.stringify({ error: "Durum gerekli" }), { status: 400 });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return new Response(JSON.stringify(updatedOrder), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Güncelleme başarısız" }), { status: 500 });
  }
}
