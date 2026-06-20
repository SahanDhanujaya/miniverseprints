'use client';

import { useActionState } from 'react';
import { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '@/lib/actions/admin-settings';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    const action = formData.get('_action') as string;
    if (action === 'delete') {
      return adminDeleteCategory(formData.get('id') as string);
    }
    if (action === 'update') {
      return adminUpdateCategory(formData.get('id') as string, formData);
    }
    return adminCreateCategory(formData);
  }, null);

  return (
    <>
      {state?.error && <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{state.error}</div>}
      {state?.success && <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">{state.success}</div>}

      {/* Add new category form */}
      <div className="bg-background-card rounded-2xl border border-border p-4 mb-6">
        <h3 className="font-medium mb-3">Add New Category</h3>
        <form action={formAction} className="flex flex-wrap gap-3 items-end">
          <input type="hidden" name="_action" value="create" />
          <Input id="cat_name" name="name" label="Name" required className="flex-1 min-w-[200px]" />
          <Input id="cat_slug" name="slug" label="Slug (auto)" className="flex-1 min-w-[200px]" />
          <Input id="cat_sort" name="sort_order" type="number" label="Sort Order" defaultValue="0" className="w-24" />
          <label className="flex items-center gap-2 text-sm py-2">
            <input type="checkbox" name="is_active" defaultChecked className="rounded" /> Active
          </label>
          <Button type="submit" isLoading={isPending}><Plus className="w-4 h-4 mr-1" /> Add</Button>
        </form>
      </div>

      {/* Category list */}
      <div className="bg-background-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Slug</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Sort</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b border-border hover:bg-background-hover">
                <td className="px-4 py-3 text-sm font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-sm text-foreground-muted">{cat.slug}</td>
                <td className="px-4 py-3 text-sm">{cat.sort_order}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${cat.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={formAction} className="inline">
                    <input type="hidden" name="_action" value="delete" />
                    <input type="hidden" name="id" value={cat.id} />
                    <button type="submit" className="p-1 text-foreground-muted hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center py-8 text-foreground-muted">No categories yet</div>
        )}
      </div>
    </>
  );
}
