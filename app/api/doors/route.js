import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const doors = await prisma.door.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(doors);
  } catch (error) {
    console.error('Error fetching doors:', error);
    return NextResponse.json({ error: 'Error fetching doors' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const door = await prisma.door.create({
      data: {
        name: data.name,
        price: parseInt(data.price),
        material: data.material,
        size: data.size,
        color: data.color,
        image: data.image,
        description: data.description
      }
    });
    return NextResponse.json(door);
  } catch (error) {
    console.error('Error creating door:', error);
    return NextResponse.json({ error: 'Error creating door' }, { status: 500 });
  }
}