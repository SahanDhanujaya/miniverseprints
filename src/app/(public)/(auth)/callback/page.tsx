"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    // Parse URL to get search params and hash tokens
    const url = new URL(window.location.href);
    const type = url.searchParams.get('type');
    const hash = window.location.hash;

    // If the fragment contains access_token (supabase recovery), set session
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const expires_in = params.get('expires_in');

      if (access_token && refresh_token) {
        const supabase = createClient();
        // setSession expects an object with access_token and refresh_token
        supabase.auth.setSession({ access_token, refresh_token }).then(({ error: setErr }) => {
          if (setErr) {
            setError(setErr.message || 'Failed to set session');
            setProcessing(false);
            return;
          }

          // If this is a recovery flow, show reset password form
          if (type === 'recovery') {
            setShowReset(true);
            setProcessing(false);
            return;
          }

          // Otherwise redirect to account
          router.replace('/account');
        }).catch((e) => {
          setError(e?.message || 'Failed to set session');
          setProcessing(false);
        });
        return;
      }
    }

    // If no hash tokens, try reading next or code in query (server-side route may handle code)
    setProcessing(false);
  }, [router]);

  if (processing) {
    return <div className="min-h-[60vh] flex items-center justify-center">Processing authentication...</div>;
  }

  if (error) {
    return <div className="min-h-[60vh] flex items-center justify-center text-error">{error}</div>;
  }

  if (showReset) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <ResetPasswordForm onSuccess={() => router.push('/login')} />
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div>
        <p className="text-center">Unable to process callback. You can try signing in manually.</p>
      </div>
    </div>
  );
}
