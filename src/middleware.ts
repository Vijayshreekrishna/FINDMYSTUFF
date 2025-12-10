import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    console.log('[Middleware] Path:', pathname);

    // Allow access to install page, static files, API routes, and auth routes
    if (
        pathname === '/install' ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/icon') ||
        pathname.startsWith('/manifest') ||
        pathname.startsWith('/offline') ||
        pathname.includes('.')
    ) {
        console.log('[Middleware] Allowing access to:', pathname);
        return NextResponse.next();
    }

    // Check if PWA is installed (cookie set after installation)
    const isPWAInstalled = request.cookies.get('pwa-installed')?.value === 'true';

    console.log('[Middleware] PWA Installed:', isPWAInstalled, 'Path:', pathname);

    // If not installed, redirect to install page
    if (!isPWAInstalled) {
        console.log('[Middleware] Redirecting to /install');
        const url = request.nextUrl.clone();
        url.pathname = '/install';
        return NextResponse.redirect(url);
    }

    console.log('[Middleware] Allowing access (PWA installed)');
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
