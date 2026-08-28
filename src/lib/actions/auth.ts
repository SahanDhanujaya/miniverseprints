'use server';

import { createClient } from '@/lib/supabase/server';
import { loginSchema, registerSchema, forgotPasswordSchema } from '@/lib/validations/auth';
import { rateLimitLogin, rateLimitRegister } from '@/lib/rate-limit';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ADMIN_EMAIL, ADMIN_PASSWORD, setAdminSession, clearAdminSession } from '@/lib/auth-session';

export async function login(formData: FormData) {
  const raw = {
    email: (formData.get('email') as string)?.trim().toLowerCase(),
    password: formData.get('password') as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;
  const redirectTarget = (formData.get('redirect') as string) || '/account';

  // Check Master Admin Credentials
  if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    await setAdminSession();
    revalidatePath('/', 'layout');
    redirect('/admin');
  }

  // Rate limit
  const limit = rateLimitLogin(raw.email);
  if (!limit.success) {
    return { error: 'Too many login attempts. Please try again later.' };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: 'Invalid email or password.' };
    }
  } catch {
    return { error: 'Invalid email or password.' };
  }

  revalidatePath('/', 'layout');
  redirect(redirectTarget);
}

export async function adminLogin(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    await setAdminSession();
    revalidatePath('/', 'layout');
    redirect('/admin');
  }

  // Attempt Supabase admin sign in as secondary option
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data?.user) {
      const role = data.user.app_metadata?.role ?? data.user.user_metadata?.role;
      if (role === 'admin') {
        await setAdminSession();
        revalidatePath('/', 'layout');
        redirect('/admin');
      }
    }
  } catch {
    // Ignore fallback error
  }

  return { error: 'Invalid admin email or password.' };
}

export async function register(formData: FormData) {
  const raw = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Rate limit
  const limit = rateLimitRegister(raw.email);
  if (!limit.success) {
    return { error: 'Too many registration attempts. Please try again later.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        phone: parsed.data.phone,
        role: 'customer',
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/account');
}

export async function logout() {
  await clearAdminSession();
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore signOut error in fallback mode
  }
  revalidatePath('/', 'layout');
  redirect('/admin/login');
}

export async function forgotPassword(formData: FormData) {
  const raw = {
    email: formData.get('email') as string,
  };

  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`,
  });

  if (error) {
    return { error: 'Could not send reset email. Please try again.' };
  }

  return { success: 'Password reset email sent! Check your inbox.' };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const first_name = formData.get('first_name') as string;
  const last_name = formData.get('last_name') as string;
  const phone = formData.get('phone') as string;

  const { error } = await supabase
    .from('profiles')
    .update({ first_name, last_name, phone })
    .eq('id', user.id);

  if (error) {
    return { error: 'Failed to update profile.' };
  }

  revalidatePath('/account/profile');
  return { success: 'Profile updated successfully!' };
}
