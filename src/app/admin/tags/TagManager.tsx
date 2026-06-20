'use client';

import { useActionState } from 'react';
import { adminCreateTag, adminDeleteTag } from '@/lib/actions/admin-settings';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Trash2, Plus } from 'lucide-react';

interface Tag { id: string; name: string; slug: string; }

export default function TagManager({ tags }: { tags: Tag[] }) {
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    const action = formData.get('_action') as string;
    if (action === 'delete') return adminDeleteTag(formData.get('id') as string);
    return adminCreateTag(formData);
  }, null);

  return (
    <>
      {state?.error && <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{state.error}</div>}
      {state?.success && <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">{state.success}</div>}

      <div className="bg-background-card rounded-2xl border border-border p-4 mb-6">
        <form action={formAction} className="flex gap-3 items-end">
          <input type="hidden" name="_action" value="create" />
          <Input id="tag_name" name="name" label="Tag Name" required className="flex-1" />
          <Button type="submit" isLoading={isPending}><Plus className="w-4 h-4 mr-1" /> Add Tag</Button>
        </form>
      </div>

      <div className="bg-background-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Slug</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag.id} className="border-b border-border hover:bg-background-hover">
                <td className="px-4 py-3 text-sm font-medium">{tag.name}</td>
                <td className="px-4 py-3 text-sm text-foreground-muted">{tag.slug}</td>
                <td className="px-4 py-3">
                  <form action={formAction} className="inline">
                    <input type="hidden" name="_action" value="delete" />
                    <input type="hidden" name="id" value={tag.id} />
                    <button type="submit" className="p-1 text-foreground-muted hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tags.length === 0 && <div className="text-center py-8 text-foreground-muted">No tags yet</div>}
      </div>
    </>
  );
}
