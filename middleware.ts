import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp?: number;
};

const COOKIE_NAME = "access_token";

function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const payload = jwtDecode<JwtPayload>(token);

    if (!payload.exp) return false;

    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(COOKIE_NAME)?.value ?? null;
  const isAuthenticated = isTokenValid(token);

  // Protected routes
  if (pathname.startsWith("/app") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Auth pages
  if (pathname.startsWith("/auth") && isAuthenticated) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/auth/:path*"],
};
