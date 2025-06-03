import prisma from '@/lib/prisma';

export async function DELETE(request, { params }) {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Eksik ID.' }), { status: 400 });
  }

  try {
    await prisma.appointment.delete({ where: { id } });
    return new Response(JSON.stringify({ message: 'Randevu silindi.' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Silme işlemi sırasında hata oluştu.' }), { status: 500 });
  }
}
