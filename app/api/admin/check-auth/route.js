import { NextResponse } from 'next/server';

export async function GET(request) {
  const isAuthenticated = request.cookies.get('admin-auth')?.value === 'true';
  return NextResponse.json({ authenticated: isAuthenticated });
}