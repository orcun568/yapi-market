import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { addressId, paymentMethod } = await request.json();
    const userId = session.user.id;

    if (!addressId) {
      return NextResponse.json({ message: 'Adres seçilmedi.' }, { status: 400 });
    }

    // Sepet ürünleri + ürün bilgileri (stok, fiyat vs)
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ message: 'Sepetiniz boş.' }, { status: 400 });
    }

    // Toplam tutar hesapla
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );

    // Transaction başlat: sipariş oluştur, stok azalt, sepeti temizle
    const order = await prisma.$transaction(async (tx) => {
      // 1. Siparişi oluştur
      const createdOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          totalAmount,
          paymentMethod,
          status: 'Sipariş Alındı',
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      });

      // 2. Her ürünün stok miktarını düşür
      for (const item of cartItems) {
        if (item.product.stock < item.quantity) {
          throw new Error(`"${item.product.name}" ürünü için yeterli stok yok.`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 3. Sepeti temizle
      await tx.cartItem.deleteMany({ where: { userId } });

      return createdOrder;
    });

    return NextResponse.json(
      { message: 'Sipariş başarıyla oluşturuldu', orderId: order.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Sipariş oluşturma hatası:', error);
    return NextResponse.json(
      { message: error.message || 'Sipariş oluşturulurken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      totalAmount: order.totalAmount,
      status: order.status,
      address: `${order.address.city}, ${order.address.district}, ${order.address.openAddress}`,
      items: order.items.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
      })),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Siparişler alınamadı:", error);
    return NextResponse.json({ error: "Hata oluştu" }, { status: 500 });
  }
}

