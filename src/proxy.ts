import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { UserRole } from "@/generated/prisma/enums";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Do not redirect www ↔ apex here. Configure canonical host only in Vercel Domains
 * (your project uses www as Production; apex → www 308 is set in Vercel).
 */

export async function proxy(req: NextRequest) {
  const demo = process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === "true";
  const { pathname } = req.nextUrl;

  if (
    !demo &&
    pathname === "/api/auth/callback/credentials" &&
    req.method === "POST"
  ) {
    const ip = clientIp(req);
    const rl = rateLimit(`login:${ip}`, 25);
    if (!rl.ok) {
      return new NextResponse("Too many login attempts. Try again later.", {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfter) },
      });
    }
  }

  if (demo) {
    return NextResponse.next();
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = token.role as UserRole | undefined;

  if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/dashboard/organization") && role !== "ORG_USER") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/dashboard/user") && role !== "INDIVIDUAL") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/auth/callback/credentials"],
};
