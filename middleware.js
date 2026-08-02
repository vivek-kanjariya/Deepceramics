// middleware.js
import { NextResponse } from 'next/server'

export default async function middleware(request) {
  console.log('Middleware running for:', request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}