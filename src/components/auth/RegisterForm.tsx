'use client';

import { useActionState } from 'react';
import { register } from '@/lib/actions/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(async (_prev: { error?: string } | null, formData: FormData) => {
    return await register(formData);
  }, null);

  return (
    <>
      {state?.error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input id="first_name" name="first_name" label="First Name" placeholder="John" required />
          <Input id="last_name" name="last_name" label="Last Name" placeholder="Doe" required />
        </div>
        <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" required />
        <Input id="phone" name="phone" type="tel" label="Mobile Number" placeholder="07X XXX XXXX" required helperText="Sri Lankan mobile number" />
        <Input id="password" name="password" type="password" label="Password" placeholder="Min. 8 characters" required />
        <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" placeholder="Re-enter password" required />
        <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
          Create Account
        </Button>
      </form>
    </>
  );
}
