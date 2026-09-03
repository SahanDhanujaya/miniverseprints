import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Comma-separated list of allowed IPs provided via ADMIN_ALLOWED_IPS env var
const allowed = process.env.ADMIN_ALLOWED_IPS ? process.env.ADMIN_ALLOWED_IPS.split(',').map(s => s.trim()) : [];

function getClientIp(req: NextRequest) {
  // Prefer X-Forwarded-For (common on proxies/CDNs)
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    // may contain multiple IPs
    return xff.split(',')[0].trim();
  }
  // Fallback to CF-Connecting-IP or Fastly-Client-IP
  const cf = req.headers.get('cf-connecting-ip') || req.headers.get('fastly-client-ip') || req.headers.get('x-real-ip');
  if (cf) return cf;
  // NextRequest may expose geo info in some environments
  // @ts-ignore - optional runtime field
  const geoIp = (req as any).geo?.ip;
  if (geoIp) return geoIp;
  return undefined;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only enforce on /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // During development on localhost, skip server-side IP blocking so the
  // client-side `AdminIpGate` can perform the IP check (we can't rely on
  // request headers locally). In production we still enforce the allowlist.
  if (process.env.NODE_ENV !== 'production') return NextResponse.next();

  // If no allowlist configured, allow by default
  if (allowed.length === 0) return NextResponse.next();

  const ip = getClientIp(req);
  if (!ip) return new NextResponse('Access denied', { status: 403 });

  // Allow if ip matches any in allowlist
  const ok = allowed.includes(ip);
  if (!ok) return new NextResponse('Access denied', { status: 403 });

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
