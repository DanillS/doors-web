import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const { operation, percentage, category = 'all' } = await request.json()

    console.log('🔄 Mass price update:', { operation, percentage, category })

    // Получаем все двери
    let query = supabase.from('Door').select('*')
    
    if (category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: doors, error } = await query

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }

    if (!doors || doors.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Не найдено товаров для обновления' 
      }, { status: 404 })
    }

    // Обновляем цены
    const updatePromises = doors.map(door => {
      const oldPrice = door.price
      let newPrice

      if (operation === 'increase') {
        newPrice = oldPrice * (1 + percentage / 100)
      } else if (operation === 'decrease') {
        newPrice = oldPrice * (1 - percentage / 100)
      } else {
        throw new Error('Неизвестная операция')
      }

      // Округляем до целых чисел
      newPrice = Math.round(newPrice)

      return supabase
        .from('Door')
        .update({ price: newPrice })
        .eq('id', door.id)
    })

    // Выполняем все обновления
    const results = await Promise.all(updatePromises)
    const errors = results.filter(result => result.error)

    if (errors.length > 0) {
      console.error('❌ Some updates failed:', errors)
      throw new Error(`Не удалось обновить ${errors.length} товаров`)
    }

    console.log(`✅ Updated ${doors.length} doors`)
    
    return NextResponse.json({
      success: true,
      message: `Цены успешно обновлены для ${doors.length} товаров`,
      updatedCount: doors.length,
      operation,
      percentage
    })

  } catch (error) {
    console.error('❌ Error updating prices:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}