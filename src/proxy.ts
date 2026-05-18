import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { UserRole } from "@/generated/prisma/enums";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const APEX_HOST = "turkiyejobs.org";

function requestHostname(req: NextRequest): string {
  const raw =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    req.nextUrl.hostname;
  return raw.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? "";
}

/** Single canonical host — avoids www ↔ apex loops with Vercel domain redirects. */
function redirectWwwToApex(req: NextRequest): NextResponse | null {
  const hostname = requestHostname(req);
  if (hostname !== "www.turkiyejobs.org") return null;

  const url = req.nextUrl.clone();
  url.protocol = "https:";
  url.hostname = APEX_HOST;
  return NextResponse.redirect(url, 308);
}

export async function proxy(req: NextRequest) {
  const wwwRedirect = redirectWwwToApex(req);
  if (wwwRedirect) return wwwRedirect;

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
  matcher: [
    /*
     * Run on all routes (for www → apex). Static assets excluded.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
