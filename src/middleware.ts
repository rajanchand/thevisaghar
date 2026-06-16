import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get JWT token from the session cookie
  const isApiAdmin = pathname.startsWith("/api/admin");
  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (isApiAdmin || isAdminPage) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // ─── Admin Page Protection ─────────────────────────────────────────────
    if (isAdminPage) {
      if (!token) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      const hasAccess = ["ADMIN", "EDITOR", "VIEWER"].includes(token.role as string);
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // ─── Admin API Protection ──────────────────────────────────────────────
    if (isApiAdmin) {
      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const hasAccess = ["ADMIN", "EDITOR", "VIEWER"].includes(token.role as string);
      if (!hasAccess) {
        return NextResponse.json(
          { error: "Forbidden — admin/editor/viewer access required" },
          { status: 403 }
        );
      }
    }

    // Optional: IP Allowlist for admin routes
    const allowedIPs = process.env.ADMIN_IP_ALLOWLIST;
    if (allowedIPs) {
      const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                       request.headers.get("x-real-ip") || "unknown";
      const allowList = allowedIPs.split(",").map((ip) => ip.trim());
      if (!allowList.includes(clientIP) && clientIP !== "unknown" && clientIP !== "127.0.0.1" && clientIP !== "::1") {
        if (isApiAdmin) {
          return NextResponse.json({ error: "Forbidden — IP not allowed" }, { status: 403 });
        }
        return new NextResponse("Forbidden", { status: 403 });
      }
    }
  }

  // ─── Body Size Limit ────────────────────────────────────────────────────
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 1_048_576 && !pathname.startsWith("/api/admin/media")) {
      // Allow media uploads up to 5MB, block other routes above 1MB
      const maxMediaSize = 5 * 1024 * 1024;
      if (pathname.startsWith("/api/admin/media") && parseInt(contentLength, 10) > maxMediaSize) {
        return new NextResponse("Payload Too Large (max 5MB)", { status: 413 });
      } else if (!pathname.startsWith("/api/admin/media")) {
        return new NextResponse("Payload Too Large (max 1MB)", { status: 413 });
      }
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
