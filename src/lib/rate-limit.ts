/**
 * Simple in-memory rate limiter for server-side use.
 * For production, consider using Redis or Upstash Ratelimit.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const limits = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of limits.entries()) {
      if (entry.resetAt < now) {
        limits.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

interface RateLimitOptions {
  /** Maximum number of requests allowed */
  limit: number;
  /** Time window in milliseconds */
  windowMs: number;
}

/**
 * Check if a request should be rate limited
 * Returns { success: true } if allowed, { success: false } if rate limited
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = limits.get(identifier);

  if (!entry || entry.resetAt < now) {
    // No entry or expired - create new
    const resetAt = now + options.windowMs;
    limits.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: options.limit - 1, resetAt };
  }

  if (entry.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: options.limit - entry.count, resetAt: entry.resetAt };
}

// Pre-configured rate limiters
export function rateLimitLogin(identifier: string) {
  return rateLimit(`login:${identifier}`, { limit: 5, windowMs: 15 * 60 * 1000 }); // 5 per 15 min
}

export function rateLimitRegister(identifier: string) {
  return rateLimit(`register:${identifier}`, { limit: 3, windowMs: 60 * 60 * 1000 }); // 3 per hour
}

export function rateLimitCheckout(identifier: string) {
  return rateLimit(`checkout:${identifier}`, { limit: 5, windowMs: 15 * 60 * 1000 }); // 5 per 15 min
}

export function rateLimitReview(identifier: string) {
  return rateLimit(`review:${identifier}`, { limit: 10, windowMs: 60 * 60 * 1000 }); // 10 per hour
}

export function rateLimitTracking(identifier: string) {
  return rateLimit(`tracking:${identifier}`, { limit: 20, windowMs: 15 * 60 * 1000 }); // 20 per 15 min
}

export function rateLimitCustomOrder(identifier: string) {
  return rateLimit(`custom-order:${identifier}`, { limit: 5, windowMs: 60 * 60 * 1000 }); // 5 per hour
}
