import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { operation, percentage, category = 'all' } = body

    console.log('🔄 Mass price update started')

    // Получаем все двери
    let query = supabase.from('Door').select('*')
    
    const { data: doors, error } = await query

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!doors || doors.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Не найдено товаров для обновления' 
      }, { status: 404 })
    }

    // Обновляем цены
    let updatedCount = 0
    let errors = []

    for (const door of doors) {
      const oldPrice = door.price
      let newPrice

      if (operation === 'increase') {
        newPrice = oldPrice * (1 + percentage / 100)
      } else if (operation === 'decrease') {
        newPrice = oldPrice * (1 - percentage / 100)
      } else {
        return NextResponse.json({ success: false, error: 'Неизвестная операция' }, { status: 400 })
      }

      // Округляем до целых чисел
      newPrice = Math.round(newPrice)

      const { error: updateError } = await supabase
        .from('Door')
        .update({ price: newPrice })
        .eq('id', door.id)

      if (updateError) {
        errors.push(updateError)
      } else {
        updatedCount++
      }
    }

    if (errors.length > 0) {
      console.error('❌ Some updates failed:', errors.length)
      return NextResponse.json({ 
        success: false, 
        error: `Не удалось обновить ${errors.length} товаров` 
      }, { status: 500 })
    }

    console.log(`✅ Updated ${updatedCount} doors`)
    
    return NextResponse.json({
      success: true,
      message: `Цены успешно обновлены для ${updatedCount} товаров`,
      updatedCount: updatedCount,
      operation,
      percentage
    })

  } catch (error) {
    console.error('❌ Error updating prices:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
}