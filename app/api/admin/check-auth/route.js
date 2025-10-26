// app/api/admin/check-auth/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const isAuthenticated = request.cookies.get('admin-auth')?.value === 'true';
    
    console.log('Auth check:', { isAuthenticated });
    
    return NextResponse.json({ 
      authenticated: isAuthenticated 
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      authenticated: false 
    });
  }
}