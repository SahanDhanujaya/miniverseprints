'use client';

import { useActionState } from 'react';
import { login } from '@/lib/actions/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function LoginForm({ redirect }: { redirect?: string }) {
  const [state, formAction, isPending] = useActionState(async (_prev: { error?: string } | null, formData: FormData) => {
    formData.set('redirect', redirect || '');
    const result = await login(formData);
    return result;
  }, null);

  return (
    <>
      {state?.error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirect" value={redirect || ''} />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          required
        />
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-accent hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
          Sign In
        </Button>
      </form>
    </>
  );
}
