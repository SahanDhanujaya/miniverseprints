import { createClient } from '@/lib/supabase/server';
import CouponManager from './CouponManager';
import { COUPON_TYPES } from '@/lib/constants';

export const metadata = { title: 'Coupons - Admin' };

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Coupons</h1>
      <CouponManager coupons={coupons || []} couponTypes={COUPON_TYPES.map(t => ({ value: t.value, label: t.label }))} />
    </div>
  );
}
