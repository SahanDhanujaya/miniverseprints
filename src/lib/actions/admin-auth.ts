'use server';

import { createClient } from '@/lib/supabase/server';
import { canAccessAdmin } from '@/lib/permissions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: 'Invalid email or password.' };
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !canAccessAdmin(user)) {
    // If not admin, sign out and reject
    await supabase.auth.signOut();
    return { error: 'Unauthorized. Admin access required.' };
  }

  revalidatePath('/admin');
  redirect('/admin');
}
