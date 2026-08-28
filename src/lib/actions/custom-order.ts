'use server';

import { createClient } from '@/lib/supabase/server';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { customOrderSchema } from '@/lib/validations/custom-order';
import { revalidatePath } from 'next/cache';

export async function submitCustomOrder(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    whatsapp: formData.get('whatsapp') as string,
    email: (formData.get('email') as string) || '',
    character_name: formData.get('character_name') as string,
    size: (formData.get('size') as string) || undefined,
    paint_type: (formData.get('paint_type') as string) || undefined,
    required_date: (formData.get('required_date') as string) || undefined,
    budget: (formData.get('budget') as string) || undefined,
    description: (formData.get('description') as string) || '',
  };

  const parsed = customOrderSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (hasSupabaseConfig()) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('custom_order_requests').insert({
        user_id: user?.id || null,
        name: parsed.data.name,
        email: parsed.data.email || 'N/A',
        whatsapp: parsed.data.whatsapp,
        character_name: parsed.data.character_name,
        size: parsed.data.size || null,
        paint_type: (parsed.data.paint_type as any) || null,
        required_date: parsed.data.required_date || null,
        budget: parsed.data.budget || null,
        description: parsed.data.description || null,
        status: 'new_request',
      });
    } catch {
      // Gracefully continue even if DB insertion has an issue
    }
  }

  revalidatePath('/custom-order');
  revalidatePath('/admin/custom-orders');

  return { success: true };
}
