import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function GET(request, { params }) {
  try {
    const { id } = await params

    const { data: door, error } = await supabase
      .from('Door')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json(door)
  } catch (error) {
    console.error('Error fetching door:', error)
    return NextResponse.json({ error: 'Door not found' }, { status: 404 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const data = await request.json()

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

    return NextResponse.json(door)
  } catch (error) {
    console.error('Error updating door:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('Door')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting door:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}