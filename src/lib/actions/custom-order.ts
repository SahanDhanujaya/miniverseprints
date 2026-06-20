'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { customOrderSchema } from '@/lib/validations/custom-order';
import { rateLimitCustomOrder } from '@/lib/rate-limit';

export async function submitCustomOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    whatsapp: formData.get('whatsapp') as string,
    character_name: formData.get('character_name') as string,
    size: formData.get('size') as string || undefined,
    paint_type: formData.get('paint_type') as string || undefined,
    required_date: formData.get('required_date') as string || undefined,
    budget: formData.get('budget') ? parseFloat(formData.get('budget') as string) : undefined,
    description: formData.get('description') as string,
    agree_terms: formData.get('agree_terms') === 'on',
  };

  const parsed = customOrderSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  if (user) {
    const limit = rateLimitCustomOrder(user.id);
    if (!limit.success) return { error: 'Too many custom order requests. Please try again later.' };
  }

  const { error } = await supabase.from('custom_order_requests').insert({
    user_id: user?.id || null,
    name: parsed.data.name,
    email: parsed.data.email,
    whatsapp: parsed.data.whatsapp,
    character_name: parsed.data.character_name,
    size: parsed.data.size || null,
    paint_type: parsed.data.paint_type || null,
    required_date: parsed.data.required_date || null,
    budget: parsed.data.budget || null,
    description: parsed.data.description,
    status: 'new_request',
  });

  if (error) return { error: 'Failed to submit custom order request.' };

  revalidatePath('/custom-order');
  return { success: 'Custom order request submitted! We will contact you soon.' };
}
