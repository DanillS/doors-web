import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'

    console.log('🔄 Fetching doors from Supabase...')

    let query = supabase.from('Door').select('*')
    
    if (!isAdmin) {
      query = query.eq('isActive', true)
    }

    const { data: doors, error } = await query.order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }

    console.log(`✅ Found ${doors?.length || 0} doors`)
    return NextResponse.json(doors || [])

  } catch (error) {
    console.error('❌ Error fetching doors:', error)
    
    // Временный fallback - вернуть пустой массив
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const data = await request.json()
    
    console.log('🔄 Creating door in Supabase...')

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

    if (error) throw error

    console.log('✅ Door created:', door.id)
    return NextResponse.json(door)

  } catch (error) {
    console.error('❌ Error creating door:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}