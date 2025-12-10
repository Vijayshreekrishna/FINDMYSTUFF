import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow access to install page, static files, API routes, and auth routes
    if (
        pathname === '/install' ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/icon') ||
        pathname.startsWith('/manifest') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check if user is in PWA mode (standalone)
    const userAgent = request.headers.get('user-agent') || '';
    const isStandalone = request.headers.get('sec-fetch-dest') === 'document' &&
        request.headers.get('sec-fetch-mode') === 'navigate';

    // Check for PWA indicators in user agent or referrer
    const isPWA = userAgent.includes('wv') || // WebView
        request.cookies.get('pwa-installed')?.value === 'true';

    // If not in PWA mode, redirect to install page
    if (!isPWA && pathname !== '/install') {
        const url = request.nextUrl.clone();
        url.pathname = '/install';
        return NextResponse.redirect(url);
    }

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
