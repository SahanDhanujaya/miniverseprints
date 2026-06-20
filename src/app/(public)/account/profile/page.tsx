import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ProfileForm from '@/components/auth/ProfileForm';

export const metadata = { title: 'Edit Profile', description: 'Update your profile' };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Profile' }]} />
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <div className="bg-background-card rounded-2xl border border-border p-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
