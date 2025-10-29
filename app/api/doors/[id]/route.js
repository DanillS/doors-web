import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request, { params }) {
  try {
    const { id } = params;

    console.log('🔄 Fetching door with ID:', id)

    const { data: door, error } = await supabase
      .from('Door')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }

    if (!door) {
      return NextResponse.json({ error: 'Door not found' }, { status: 404 })
    }

    console.log('✅ Door found:', door.name)
    return NextResponse.json(door)

  } catch (error) {
    console.error('❌ Error fetching door:', error)
    return NextResponse.json({ error: 'Door not found' }, { status: 404 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json()

    console.log('🔄 Updating door with ID:', id)

    const { data: door, error } = await supabase
      .from('Door')
      .update({
        name: data.name,
        price: data.price,
        material: data.material,
        size: data.size,
        color: data.color,
        glass: data.glass,
        tearType: data.tearType,
        image: data.image,
        images: data.images || [],
        description: data.description,
        isActive: data.isActive
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    console.log('✅ Door updated:', door.id)
    return NextResponse.json(door)

  } catch (error) {
    console.error('❌ Error updating door:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    console.log('🔄 Deleting door with ID:', id)

    const { error } = await supabase
      .from('Door')
      .delete()
      .eq('id', id)

    if (error) throw error

    console.log('✅ Door deleted:', id)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Error deleting door:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}