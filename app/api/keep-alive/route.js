import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    // Простой запрос чтобы разбудить Supabase
    const { data, error } = await supabase
      .from('Door')
      .select('id')
      .limit(1);

    console.log('🔄 Keep-alive executed:', new Date().toISOString());
    
    return NextResponse.json({ 
      status: 'ok',
      message: 'Supabase is awake!',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Keep-alive error:', error.message);
    return NextResponse.json({ 
      status: 'error',
      error: error.message 
    }, { status: 500 });
  }
}