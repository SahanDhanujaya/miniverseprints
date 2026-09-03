'use client';

import { useActionState } from 'react';
import { adminLogin } from '@/lib/actions/admin-auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    return adminLogin(formData);
  }, null);

  return (
    <>
      {state?.error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <Input id="email" name="email" type="email" label="Email" required />
        <Input id="password" name="password" type="password" label="Password" required />
        <Button type="submit" className="w-full" size="lg" isLoading={isPending}>Sign In</Button>
      </form>
    </>
  );
}
