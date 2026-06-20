import { createClient } from '@/lib/supabase/server';
import BannerManager from './BannerManager';

export const metadata = { title: 'Banners - Admin' };

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data: banners } = await supabase.from('homepage_banners').select('*').order('sort_order');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Banners</h1>
      <BannerManager banners={banners || []} />
    </div>
  );
}
