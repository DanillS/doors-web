import { NextResponse } from 'next/server';
import { createPrismaClient } from '../../../../lib/prisma';

export async function GET(request, { params }) {
  const prisma = createPrismaClient();
  
  try {
    const { id } = await params;
    const doorId = parseInt(id);
    
    const door = await prisma.door.findUnique({
      where: { id: doorId }
    });

    if (!door) {
      return NextResponse.json({ error: 'Door not found' }, { status: 404 });
    }

    return NextResponse.json(door);
  } catch (error) {
    console.error('Error fetching door:', error);
    return NextResponse.json({ error: 'Error fetching door' }, { status: 500 });
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

export async function PUT(request, { params }) {
  const prisma = createPrismaClient();
  
  try {
    const { id } = await params;
    const data = await request.json();
    
    const door = await prisma.door.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        price: parseInt(data.price),
        material: data.material,
        size: data.size,
        tearType: data.tearType,
        color: data.color,
        image: data.image,
        images: Array.isArray(data.images) ? data.images : [],
        description: data.description,
        isActive: data.isActive
      }
    });
    
    // Очищаем кэш
    if (typeof global.__doorCache !== 'undefined') {
      global.__doorCache = null;
    }
    
    return NextResponse.json(door);
  } catch (error) {
    console.error('Error updating door:', error);
    return NextResponse.json({ error: 'Error updating door' }, { status: 500 });
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

export async function DELETE(request, { params }) {
  const prisma = createPrismaClient();
  
  try {
    const { id } = await params;
    const doorId = parseInt(id);
    
    console.log('🔄 Deleting door:', doorId);
    
    await prisma.door.delete({
      where: { id: doorId }
    });
    
    // Очищаем кэш
    if (typeof global.__doorCache !== 'undefined') {
      global.__doorCache = null;
    }
    
    console.log('✅ Door deleted:', doorId);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('❌ Error deleting door:', error);
    return NextResponse.json(
      { error: 'Error deleting door' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}