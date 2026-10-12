'use client';

import { usePathname } from 'next/navigation';
import FallingStars from './FallingStars';

export default function PublicFallingStars() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || pathname === '/admin-login') {
    return null;
  }

  return <FallingStars />;
}
