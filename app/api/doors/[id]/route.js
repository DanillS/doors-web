import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const door = await prisma.door.findUnique({
      where: { id: parseInt(id) }
    });

    if (!door) {
      return NextResponse.json({ error: 'Door not found' }, { status: 404 });
    }

    return NextResponse.json(door);
  } catch (error) {
    console.error('Error fetching door:', error);
    return NextResponse.json({ error: 'Error fetching door' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const door = await prisma.door.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        price: parseInt(data.price),
        material: data.material,
        size: data.size,
        color: data.color,
        image: data.image,
        description: data.description,
        isActive: data.isActive
      }
    });
    return NextResponse.json(door);
  } catch (error) {
    console.error('Error updating door:', error);
    return NextResponse.json({ error: 'Error updating door' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.door.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting door:', error);
    return NextResponse.json({ error: 'Error deleting door' }, { status: 500 });
  }
}