import { createClient } from '@/lib/supabase/server';
import TagManager from './TagManager';

export const metadata = { title: 'Tags - Admin' };

export default async function AdminTagsPage() {
  const supabase = await createClient();
  const { data: tags } = await supabase.from('tags').select('*').order('name');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tags</h1>
      <TagManager tags={tags || []} />
    </div>
  );
}
