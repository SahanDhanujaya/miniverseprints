"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { resetPasswordSchema } from '@/lib/validations/auth';

export default function ResetPasswordForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const form = new FormData(e.currentTarget);
    const password = form.get('password') as string;
    const confirmPassword = form.get('confirmPassword') as string;

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message || 'Failed to update password');
        return;
      }
      setSuccess('Password updated successfully. You can now sign in.');
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {error && <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-background-card rounded-2xl border border-border p-6">
        <h2 className="font-bold">Set a new password</h2>
        <Input id="password" name="password" type="password" label="New password" required />
        <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm password" required />
        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>Update password</Button>
      </form>
    </div>
  );
}
