import { cookies } from 'next/headers';

export const ADMIN_EMAIL = 'chaniyarvc@gmail.com';
export const ADMIN_PASSWORD = '139Miniverse@11';
export const ADMIN_COOKIE_NAME = 'mvp_admin_session';

export interface AdminSession {
  email: string;
  role: 'admin';
  name: string;
  authenticatedAt: string;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8')) as AdminSession;
    if (session.email === ADMIN_EMAIL && session.role === 'admin') {
      return session;
    }
  } catch {
    return null;
  }

  return null;
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionData: AdminSession = {
    email: ADMIN_EMAIL,
    role: 'admin',
    name: 'Chaniya',
    authenticatedAt: new Date().toISOString(),
  };

  const encoded = Buffer.from(JSON.stringify(sessionData)).toString('base64');

  cookieStore.set(ADMIN_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
