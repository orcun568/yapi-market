import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phoneNumber: true,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ error: 'Kullanıcılar alınamadı' }, { status: 500 })
  }
}


export async function DELETE(req) {
  try {
    const body = await req.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID eksik.' }, { status: 400 })
    }

    // İlişkili verileri sil
    await prisma.cartItem.deleteMany({ where: { userId } })
    await prisma.address.deleteMany({ where: { userId } })
    await prisma.order.deleteMany({ where: { userId } })
    await prisma.appointment.deleteMany({ where: { userId } })

    // Kullanıcıyı sil
    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

