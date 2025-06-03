export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    const { name, hexCode, stock } = await request.json();

    if (!name || !hexCode) {
      return new Response('Eksik alan var', { status: 400 });
    }

    const updatedColor = await prisma.paintColor.update({
      where: { id },
      data: {
        name,
        hexCode,
        stock: stock ?? 0,
      },
    });

    return new Response(JSON.stringify(updatedColor), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Sunucu hatası veya ID bulunamadı', { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);

    await prisma.paintColor.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response('Sunucu hatası veya ID bulunamadı', { status: 500 });
  }
}