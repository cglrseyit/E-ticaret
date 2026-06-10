import { NextResponse, type NextRequest } from "next/server";

/**
 * Ensures every visitor has a stable `sid` cookie (30 days) used to tie
 * analytics events and carts to a session. Admin protection is added in Faz 5.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin guard: redirect to login when the auth cookie is missing.
  // (Full JWT verification happens in the admin layout — edge can't verify.)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!req.cookies.get("admin_token")) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();

  if (!req.cookies.get("sid")) {
    const sid = crypto.randomUUID();
    res.cookies.set("sid", sid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return res;
}

export const config = {
  // Run on everything except static assets and image optimizer.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|products/|.*\\.svg).*)"],
};
