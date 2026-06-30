import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = req.cookies.get("sc_admin_session");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!session || !adminPassword) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const decoded = Buffer.from(session.value, "base64").toString("utf8");
      if (decoded !== adminPassword) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
