'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/lib/actions/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, isPending] = useActionState(async (_prev: { error?: string; success?: string } | null, formData: FormData) => {
    return await updateProfile(formData);
  }, null);

  return (
    <>
      {state?.error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">
          {state.success}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input id="first_name" name="first_name" label="First Name" defaultValue={profile?.first_name || ''} required />
          <Input id="last_name" name="last_name" label="Last Name" defaultValue={profile?.last_name || ''} required />
        </div>
        <Input id="phone" name="phone" type="tel" label="Mobile Number" defaultValue={profile?.phone || ''} />
        <Button type="submit" isLoading={isPending}>Save Changes</Button>
      </form>
    </>
  );
}
