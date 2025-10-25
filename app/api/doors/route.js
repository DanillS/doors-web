import { NextResponse } from 'next/server';
import { createPrismaClient } from '../../../lib/prisma';

// Простой in-memory кэш
let cache = {
  data: null,
  timestamp: 0,
  type: '' // 'admin' или 'public'
};
const CACHE_TIME = 30000; // 30 секунд

export async function GET(request) {
  // СОЗДАЕМ НОВЫЙ КЛИЕНТ для каждого запроса
  const prisma = createPrismaClient();
  
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    const cacheType = isAdmin ? 'admin' : 'public';
    
    // Проверяем кэш
    const now = Date.now();
    if (cache.data && cache.type === cacheType && (now - cache.timestamp) < CACHE_TIME) {
      await prisma.$disconnect();
      return NextResponse.json(cache.data);
    }
    
    console.log('🔄 Fetching doors from database...');
    
    const doors = await prisma.door.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ Found ${doors.length} doors`);
    
    // Обновляем кэш
    cache = {
      data: doors,
      timestamp: now,
      type: cacheType
    };
    
    return NextResponse.json(doors);
    
  } catch (error) {
    console.error('❌ Error fetching doors:', error);
    
    // При ошибке возвращаем кэш или пустой массив
    if (cache.data) {
      return NextResponse.json(cache.data);
    }
    
    return NextResponse.json([]);
  } finally {
    // ВСЕГДА закрываем соединение
    await prisma.$disconnect().catch(() => {});
  }
}

export async function POST(request) {
  const prisma = createPrismaClient();
  
  try {
    const data = await request.json();
    
    console.log('🔄 Creating new door...');
    
    const door = await prisma.door.create({
      data: {
        name: data.name,
        price: parseInt(data.price),
        material: data.material,
        size: data.size,
        color: data.color,
        tearType: data.tearType,
        image: data.image || '',
        images: Array.isArray(data.images) ? data.images : [],
        description: data.description || '',
        isActive: data.isActive !== undefined ? data.isActive : true
      }
    });
    
    // Очищаем кэш
    cache.data = null;
    
    console.log('✅ Door created:', door.id);
    
    return NextResponse.json(door);
    
  } catch (error) {
    console.error('❌ Error creating door:', error);
    return NextResponse.json(
      { error: 'Error creating door' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}