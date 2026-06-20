'use client';

import { useActionState } from 'react';
import { adminCreateBanner, adminDeleteBanner } from '@/lib/actions/admin-settings';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface Banner { id: string; title: string; subtitle: string | null; image_url: string; link_url: string | null; sort_order: number; is_active: boolean; }

export default function BannerManager({ banners }: { banners: Banner[] }) {
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    const action = formData.get('_action') as string;
    if (action === 'delete') return adminDeleteBanner(formData.get('id') as string);
    return adminCreateBanner(formData);
  }, null);

  return (
    <>
      {state?.error && <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{state.error}</div>}
      {state?.success && <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">{state.success}</div>}

      <div className="bg-background-card rounded-2xl border border-border p-4 mb-6">
        <h3 className="font-medium mb-3">Add Banner</h3>
        <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
          <input type="hidden" name="_action" value="create" />
          <Input name="title" label="Title" required />
          <Input name="subtitle" label="Subtitle" />
          <Input name="image_url" label="Image URL" required />
          <Input name="link_url" label="Link URL" />
          <Input name="sort_order" type="number" label="Sort Order" defaultValue="0" />
          <label className="flex items-center gap-2 text-sm py-2">
            <input type="checkbox" name="is_active" defaultChecked className="rounded" /> Active
          </label>
          <Button type="submit" isLoading={isPending}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </form>
      </div>

      <div className="space-y-4">
        {banners.map(banner => (
          <div key={banner.id} className="bg-background-card rounded-2xl border border-border p-4 flex items-center gap-4">
            <div className="w-32 h-20 rounded-xl bg-background-hover overflow-hidden flex-shrink-0">
              {banner.image_url && <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{banner.title}</h3>
              {banner.subtitle && <p className="text-sm text-foreground-muted">{banner.subtitle}</p>}
              <p className="text-xs text-foreground-muted mt-1">Sort: {banner.sort_order} | {banner.is_active ? 'Active' : 'Inactive'}</p>
            </div>
            <form action={formAction}>
              <input type="hidden" name="_action" value="delete" />
              <input type="hidden" name="id" value={banner.id} />
              <button type="submit" className="p-2 text-foreground-muted hover:text-error"><Trash2 className="w-5 h-5" /></button>
            </form>
          </div>
        ))}
        {banners.length === 0 && <div className="text-center py-8 text-foreground-muted">No banners</div>}
      </div>
    </>
  );
}
