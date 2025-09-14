import { NextRequest, NextResponse } from 'next/server';

import createIntlMiddleware from 'next-intl/middleware';

import { getSessionCookie } from 'better-auth/cookies';

import { routes } from './constants/routes';
import { routing } from './i18n/routing';

const PUBLIC_ROUTES = ['/sign-in', '/sign-up', '/forgot-password', '/success'];

const intlMiddleware = createIntlMiddleware(routing);

// Helper to normalize path correctly
function getNormalizedPath(pathname: string): string {
  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  const LOCALES = routing.locales; // e.g. ['en', 'fr', 'de']

  if (LOCALES.includes(maybeLocale)) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname; // no locale prefix
}

export default function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  const LOCALES = routing.locales;
  const locale = LOCALES.includes(maybeLocale)
    ? maybeLocale
    : routing.defaultLocale;

  const normalizedPath = getNormalizedPath(pathname) || '/';

  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = Boolean(sessionCookie);

  const isPublicRoute = PUBLIC_ROUTES.includes(normalizedPath);

  // Debug logs (remove in production)
  console.log({
    pathname,
    normalizedPath,
    isAuthenticated,
    session: sessionCookie,
  });

  // Redirect unauthenticated users from protected routes
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(`${origin}/${locale}${routes.signIn}`);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(`${origin}/${locale}${routes.dashboard}`);
  }

  // Pass to i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
