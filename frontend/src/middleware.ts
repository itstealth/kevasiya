import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminTokenCookie = request.cookies.get("adminToken");

  const isLoggedIn = adminTokenCookie && adminTokenCookie.value;

  // If trying to access a protected admin route and is not logged in, redirect to login
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !isLoggedIn
  ) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname); // Optional: redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access the login page but is already logged in, redirect to the admin dashboard
  if (pathname === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Add pathname to headers for metadata generation
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
