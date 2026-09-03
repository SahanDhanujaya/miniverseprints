'use client';

import { useEffect, useState, PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/ui/Spinner';

export default function AdminIpGate({ allowedIp, children }: PropsWithChildren<{ allowedIp: string }>) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [clientIp, setClientIp] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function checkIp() {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        const ip = data.ip as string;
        console.log('Client IP:', ip);
        if (!mounted) return;
        setClientIp(ip);
        const ok = ip === (allowedIp || '').trim();
        setAllowed(ok);
      } catch (e) {
        setAllowed(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }

    checkIp();

    return () => { mounted = false; };
  }, [allowedIp]);

  if (checking) return <div className="p-8"><Spinner /></div>;

  if (!allowed) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
        <p className="text-sm text-foreground-muted mb-4">Your IP ({clientIp || 'unknown'}) is not permitted to access the admin area.</p>
        <p className="text-sm">If you believe this is an error, contact the site administrator.</p>
      </div>
    );
  }

  return <>{children}</>;
}
