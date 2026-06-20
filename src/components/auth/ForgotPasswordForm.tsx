'use client';

import { useActionState } from 'react';
import { forgotPassword } from '@/lib/actions/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(async (_prev: { error?: string; success?: string } | null, formData: FormData) => {
    return await forgotPassword(formData);
  }, null);

  return (
    <>
      {state?.error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{state.error}</div>
      )}
      {state?.success && (
        <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">{state.success}</div>
      )}
      <form action={formAction} className="space-y-4">
        <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" required />
        <Button type="submit" className="w-full" size="lg" isLoading={isPending}>Send Reset Link</Button>
      </form>
      <p className="mt-4 text-center text-sm text-foreground-muted">
        <Link href="/login" className="text-accent hover:underline">Back to login</Link>
      </p>
    </>
  );
}
