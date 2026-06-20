import type { UserRole } from '@/types';

interface RoleSource {
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

export function getUserRole(user: RoleSource | null | undefined): UserRole {
  const role = user?.app_metadata?.role ?? user?.user_metadata?.role;
  return role === 'admin' ? 'admin' : 'customer';
}

export function canAccessAdmin(user: RoleSource | null | undefined): boolean {
  return getUserRole(user) === 'admin';
}
