// app/api/admin/login/route.js
import { NextResponse } from 'next/server';
import { adminConfig } from '../../../../config/admin';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt:', { username });

    if (username === adminConfig.username && password === adminConfig.password) {
      const response = NextResponse.json({ 
        success: true,
        message: 'Успешный вход'
      });
      
      // Устанавливаем cookie с сессией
      response.cookies.set('admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: adminConfig.sessionDuration,
        path: '/'
      });

      console.log('Login successful');
      return response;
    }

    console.log('Login failed: invalid credentials');
    return NextResponse.json({ 
      success: false, 
      error: 'Неверные логин или пароль' 
    }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Ошибка сервера' 
    }, { status: 500 });
  }
}