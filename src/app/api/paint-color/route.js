import { NextResponse } from 'next/server'
import  prisma  from '@/lib/prisma'

export async function GET() {
  try {
    const colors = await prisma.paintColor.findMany({
      select: {
        id: true,
        name: true,
        hexCode: true,
        stock: true
      }
    })

    return NextResponse.json(colors)
  } catch (error) {
    console.error('PaintColor fetch error:', error)
    return NextResponse.json({ error: 'Boya renkleri getirilemedi.' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, hexCode, stock } = body;

    if (!name || !hexCode) {
      return new Response(JSON.stringify({ error: "name and hexCode are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newColor = await prisma.paintColor.create({
      data: {
        name,
        hexCode,
        stock: stock ?? 0,
      },
    });

    return new Response(JSON.stringify(newColor), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}