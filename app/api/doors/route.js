// app/api/doors/route.js
import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'

    console.log('🔄 Fetching doors from Supabase...')

    // Проверяем подключение к Supabase
    if (!supabase) {
      console.error('❌ Supabase client not initialized')
      return NextResponse.json([], { status: 200 })
    }

    let query = supabase.from('Door').select('*')
    
    if (!isAdmin) {
      query = query.eq('isActive', true)
    }

    const { data: doors, error } = await query.order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Supabase error:', error.message)
      // Возвращаем пустой массив вместо ошибки
      return NextResponse.json([])
    }

    console.log(`✅ Found ${doors?.length || 0} doors`)
    return NextResponse.json(doors || [])

  } catch (error) {
    console.error('❌ Error fetching doors:', error.message)
    
    // В случае любой ошибки возвращаем пустой массив
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    console.log('🔄 Creating door in Supabase...')

    if (!supabase) {
      console.error('❌ Supabase client not initialized')
      return NextResponse.json({ error: 'Database not available' }, { status: 500 })
    }

    const { data: door, error } = await supabase
      .from('Door')
      .insert([
        {
          name: data.name,
          price: data.price,
          material: data.material,
          size: data.size,
          color: data.color,
          image: data.image || '',
          images: data.images || [],
          description: data.description || '',
          glass: data.glass || 'Без стекла',
          tearType: data.tearType || 'Распашная',
          isActive: data.isActive !== undefined ? data.isActive : true
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('❌ Supabase insert error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Door created:', door.id)
    return NextResponse.json(door)

  } catch (error) {
    console.error('❌ Error creating door:', error.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}