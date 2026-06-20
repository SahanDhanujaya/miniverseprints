import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login',
  description: 'Login to your MiniVersePrints account',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/account');
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-background-card rounded-2xl border border-border p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-foreground-muted text-center mb-8">Sign in to your MiniVersePrints account</p>

          {params.error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">
              {params.error === 'auth' ? 'Authentication failed. Please try again.' : params.error}
            </div>
          )}

          <LoginForm redirect={params.redirect} />

          <p className="mt-6 text-center text-sm text-foreground-muted">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-accent hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
