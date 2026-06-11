/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach. No external dependencies required.
 *
 * Usage:
 *   import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
 *   const { success } = rateLimit(`contact:${ip}`, RATE_LIMITS.contact);
 */

interface RateLimitConfig {
  /** Time window in milliseconds */
  interval: number;
  /** Max requests per window */
  maxRequests: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/** Pre-configured rate limit configs */
export const RATE_LIMITS = {
  /** 5 requests per minute — contact form submissions */
  contact: { interval: 60_000, maxRequests: 5 },
  /** 5 requests per minute — booking submissions */
  booking: { interval: 60_000, maxRequests: 5 },
  /** 10 requests per minute — AI chat messages */
  chat: { interval: 60_000, maxRequests: 10 },
  /** 20 requests per minute — general API reads */
  read: { interval: 60_000, maxRequests: 20 },
  /** 30 requests per minute — admin write operations */
  adminWrite: { interval: 60_000, maxRequests: 30 },
  /** 5 requests per 15 minutes — login attempts */
  login: { interval: 15 * 60_000, maxRequests: 5 },
} as const;

const bucket = new Map<string, RateLimitEntry>();

// Periodically clean expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of bucket) {
    if (now > entry.resetTime) {
      bucket.delete(key);
    }
  }
}, 60_000);

/**
 * Check rate limit for a given identifier.
 * @param identifier - Unique key (e.g. "contact:192.168.1.1")
 * @param config - Rate limit configuration
 * @returns { success, remaining, resetIn }
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; resetIn: number } {
  const { interval, maxRequests } = config;
  const now = Date.now();

  const entry = bucket.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Window expired or first request — reset
    bucket.set(identifier, { count: 1, resetTime: now + interval });
    return { success: true, remaining: maxRequests - 1, resetIn: interval };
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  // Increment counter
  entry.count += 1;
  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

/**
 * Extract client IP from a request.
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}
