import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { operation, percentage, category = 'all' } = body

    console.log('🔄 Mass price update started:', { operation, percentage })

    if (!operation || !percentage || percentage <= 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Неверные параметры операции' 
      }, { status: 400 })
    }

    // 1. Получаем все двери из базы
    let query = supabase.from('Door').select('*')
    const { data: doors, error: fetchError } = await query

    if (fetchError) {
      console.error('❌ Error fetching doors:', fetchError)
      return NextResponse.json({ success: false, error: 'Ошибка получения данных' }, { status: 500 })
    }

    if (!doors || doors.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Не найдено товаров для обновления' 
      }, { status: 404 })
    }

    // 2. Обновляем цены в базе данных
    let updatedCount = 0
    let errors = []

    for (const door of doors) {
      // ВАЖНО: используем base_price для расчетов!
      const basePrice = door.base_price || door.price
      let newPrice

      if (operation === 'increase') {
        newPrice = basePrice * (1 + percentage / 100)
      } else if (operation === 'decrease') {
        newPrice = basePrice * (1 - percentage / 100)
      } else {
        return NextResponse.json({ success: false, error: 'Неизвестная операция' }, { status: 400 })
      }

      // Округляем до целых чисел
      newPrice = Math.round(newPrice)

      // 3. Обновляем только price, base_price остается неизменной!
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

    console.log(`✅ Updated ${updatedCount} doors in Supabase`)
    
    return NextResponse.json({
      success: true,
      message: `Цены успешно обновлены для ${updatedCount} товаров`,
      updatedCount: updatedCount,
      operation,
      percentage,
      note: 'Проценты рассчитываются относительно базовой цены'
    })

  } catch (error) {
    console.error('❌ Error updating prices:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 })
  }
}