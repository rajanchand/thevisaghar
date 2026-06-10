import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Admin Route Protection ─────────────────────────────────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Optional: IP Allowlist for admin routes
    const allowedIPs = process.env.ADMIN_IP_ALLOWLIST;
    if (allowedIPs) {
      const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                       request.headers.get("x-real-ip") || "unknown";
      const allowList = allowedIPs.split(",").map((ip) => ip.trim());
      if (!allowList.includes(clientIP) && clientIP !== "unknown" && clientIP !== "127.0.0.1" && clientIP !== "::1") {
        return new NextResponse("Forbidden", { status: 403 });
      }
    }
  }

  // ─── Body Size Limit ────────────────────────────────────────────────────
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 1_048_576) {
      return new NextResponse("Payload Too Large", { status: 413 });
    }
  }

  // ─── Security Headers ──────────────────────────────────────────────────
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), browsing-topics=()"
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self'",
        "img-src 'self' data: blob: https://res.cloudinary.com https://maps.googleapis.com https://maps.gstatic.com",
        "connect-src 'self' https://api.anthropic.com https://api.resend.com",
        "frame-src https://www.google.com https://maps.google.com",
      ].join("; ")
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
};
