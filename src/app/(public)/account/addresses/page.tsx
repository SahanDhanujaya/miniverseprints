import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';

export const metadata = { title: 'Addresses', description: 'Manage your addresses' };

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: addresses } = await supabase.from('addresses').select('*').eq('user_id', user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Addresses' }]} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Button size="sm">Add Address</Button>
      </div>
      {!addresses?.length ? (
        <p className="text-foreground-muted">No addresses saved yet.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="p-4 bg-background-card rounded-2xl border border-border">
              <div className="font-medium">{addr.first_name} {addr.last_name}</div>
              <div className="text-sm text-foreground-muted">{addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ''}</div>
              <div className="text-sm text-foreground-muted">{addr.city}, {addr.district}</div>
              <div className="text-sm text-foreground-muted">{addr.phone}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
