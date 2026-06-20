import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { SRI_LANKA_PROVINCES, SRI_LANKA_DISTRICTS, PAYMENT_METHODS } from '@/lib/constants';
import { createOrder } from '@/lib/actions/checkout';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export const metadata = { title: 'Checkout', description: 'Complete your order' };

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/checkout');

  const { data: cart } = await supabase
    .from('carts')
    .select('*, cart_items(*, product:products(id, name, slug, regular_price, sale_price), variation:product_variations(price_adjustment))')
    .eq('user_id', user.id)
    .single();

  if (!cart?.cart_items?.length) redirect('/cart');

  const { data: shippingZones } = await supabase
    .from('shipping_zones')
    .select('*, shipping_rates(*)')
    .eq('is_active', true);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <CheckoutForm
        profile={profile}
        shippingZones={shippingZones || []}
        cart={cart}
      />
    </div>
  );
}
