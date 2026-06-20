import { createClient } from '@/lib/supabase/server';
import SettingsManager from './SettingsManager';

export const metadata = { title: 'Settings - Admin' };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').order('key');
  const { data: bankDetails } = await supabase.from('bank_details').select('*').order('created_at');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SettingsManager settings={settings || []} bankDetails={bankDetails || []} />
    </div>
  );
}
