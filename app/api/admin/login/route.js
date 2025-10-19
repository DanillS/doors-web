import { NextResponse } from 'next/server';
import { adminConfig } from '../../../../config/admin';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (username === adminConfig.username && password === adminConfig.password) {
      const response = NextResponse.json({ success: true });
      
      // Устанавливаем cookie с сессией
      response.cookies.set('admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: adminConfig.sessionDuration
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Неверные данные' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Ошибка сервера' }, { status: 500 });
  }
}