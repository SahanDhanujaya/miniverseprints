import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import ShippingManager from './ShippingManager';

export const metadata = { title: 'Shipping - Admin' };

export default async function AdminShippingPage() {
  const supabase = await createClient();
  const { data: zones } = await supabase.from('shipping_zones').select('*, rates:shipping_rates(*)').order('name');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shipping</h1>
      <ShippingManager zones={zones || []} />
    </div>
  );
}
