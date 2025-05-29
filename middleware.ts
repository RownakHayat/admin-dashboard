import { NextRequest, NextResponse } from 'next/server';
export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get('token')?.value
    if (currentUser) {
      return NextResponse.next();
    }else{
      return Response.redirect(new URL('/', request.url))
    }
    
}
export const config = {
    matcher: [
        '/admin',
        '/admin/(.*)',
        '/admin/:path*'
    ]
}