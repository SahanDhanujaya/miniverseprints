'use client';

import { useActionState } from 'react';
import { adminCreateGalleryItem, adminDeleteGalleryItem } from '@/lib/actions/admin-gallery';
import Input from '@/components/ui/Input';
import MediaUploader from '@/components/admin/MediaUploader';
import Button from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: 'image' | 'video';
  category: 'printing_process' | 'final_output';
  sort_order: number;
  is_active: boolean;
};

export default function GalleryManager({ items }: { items: GalleryItem[] }) {
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    if (formData.get('_action') === 'delete') return adminDeleteGalleryItem(formData.get('id') as string);
    return adminCreateGalleryItem(formData);
  }, null);

  return (
    <>
      {state?.error && <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{state.error}</div>}
      {state?.success && <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">{state.success}</div>}

      <div className="bg-background-card rounded-2xl border border-border p-5 mb-6">
        <h2 className="font-bold mb-4">Add Gallery Photo or Video</h2>
        <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <input type="hidden" name="_action" value="create" />
          <Input name="title" label="Title" placeholder="Printing process or final output" required />
          <Input name="description" label="Description" />
          <div>
            <label className="block text-sm font-medium mb-1.5">Media Type</label>
            <select name="media_type" className="w-full px-4 py-2.5 rounded-xl bg-background-card border border-border text-foreground">
              <option value="image">Photo</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Gallery Section</label>
            <select name="category" className="w-full px-4 py-2.5 rounded-xl bg-background-card border border-border text-foreground">
              <option value="final_output">Final Output</option>
              <option value="printing_process">Printing Process</option>
            </select>
          </div>
          <Input name="sort_order" type="number" label="Sort Order" defaultValue="0" />
          <label className="flex items-center gap-2 text-sm py-2"><input type="checkbox" name="is_active" defaultChecked className="rounded" /> Active</label>
          <div className="md:col-span-2 rounded-xl border border-border p-4">
            <MediaUploader bucketPath="gallery" accept="image/*,video/*" multiple={false} name="media_url" />
          </div>
          <Button type="submit" isLoading={isPending}><Plus className="w-4 h-4 mr-1" /> Add to Gallery</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-background-card rounded-2xl border border-border overflow-hidden">
            <div className="aspect-video bg-black">
              {item.media_type === 'video' ? <video src={item.media_url} controls className="w-full h-full object-cover" /> : <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4 flex items-start gap-3">
              <div className="flex-1"><h3 className="font-medium">{item.title}</h3><p className="text-xs text-foreground-muted mt-1">{item.category === 'printing_process' ? 'Printing Process' : 'Final Output'} · {item.is_active ? 'Active' : 'Hidden'}</p></div>
              <form action={formAction}><input type="hidden" name="_action" value="delete" /><input type="hidden" name="id" value={item.id} /><button type="submit" className="p-2 text-foreground-muted hover:text-error"><Trash2 className="w-4 h-4" /></button></form>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="text-center py-12 text-foreground-muted">No gallery items yet.</div>}
    </>
  );
}
