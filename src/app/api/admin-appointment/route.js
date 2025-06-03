import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        paintColor: true,
        user: true,
      },
    });
    return new Response(JSON.stringify(appointments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Randevular alınırken hata oluştu.' }), { status: 500 });
  }
}
