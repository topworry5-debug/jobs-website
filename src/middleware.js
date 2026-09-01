import { NextResponse } from 'next/server';

// Secret admin authentication token hash (Can also be configured via process.env.ADMIN_AUTH_SECRET)
const ADMIN_SESSION_COOKIE = 'rozgar_admin_session';
const DEFAULT_ADMIN_TOKEN = 'rozgar_pk_sec_admin_auth_9921_valid';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin and /api/admin paths
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Allow access to login page and authentication endpoint
    if (pathname === '/admin/login' || pathname === '/api/admin/auth') {
      const response = NextResponse.next();
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
      return response;
    }

    // Check for admin session cookie or Authorization header
    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const authHeader = request.headers.get('Authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = sessionCookie || bearerToken;
    const expectedToken = process.env.ADMIN_AUTH_TOKEN || DEFAULT_ADMIN_TOKEN;

    const isAuthenticated = token && token === expectedToken;

    if (!isAuthenticated) {
      // If API request, return 401 JSON
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
          { error: "Unauthorized: Valid admin authentication credentials required." },
          { 
            status: 401,
            headers: {
              'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet'
            }
          }
        );
      }

      // If Page request, redirect to /admin/login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
      return redirectResponse;
    }

    // Authenticated request: proceed with security headers
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'no-referrer');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
