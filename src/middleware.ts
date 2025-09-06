import { NextRequest } from 'next/server';

import createIntlMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

// const PROTECTED_ROUTES = ['/membership', '/dashboard'];
// const AUTH_ROUTES = ['/sign-in'];

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  // const { pathname, origin } = request.nextUrl;
  // const segments = pathname.split('/');
  // const locale = segments[1];
  // const normalizedPath = pathname.replace(`/${locale}`, '') || '/';
  // const isAuthenticated = Boolean(
  //   request.cookies.get(COOKIE_KEYS.ACCESS)?.value,
  // );
  // // If not authenticated and accessing protected routes
  // if (
  //   !isAuthenticated &&
  //   PROTECTED_ROUTES.some((route) => normalizedPath.startsWith(route))
  // ) {
  //   return NextResponse.redirect(`${origin}/${locale}${routes.signIn}`);
  // }
  // // If authenticated and trying to access auth-only route
  // if (isAuthenticated && AUTH_ROUTES.includes(normalizedPath)) {
  //   return NextResponse.redirect(`${origin}/${locale}${routes.dashboard}`);
  // }
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
