import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, oldPassword, newPassword } = body;

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json({ message: 'Eksik parametre' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ message: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Eski şifre yanlış' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: 'Şifre başarıyla güncellendi' }, { status: 200 });
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'GET method not allowed' }, { status: 405 });
}
