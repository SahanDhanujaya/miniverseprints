'use client';

import { useActionState } from 'react';
import { adminCreateCoupon, adminDeleteCoupon } from '@/lib/actions/admin-settings';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

interface Coupon { id: string; code: string; type: string; value: number; min_order_amount: number | null; usage_limit: number | null; per_customer_limit: number | null; starts_at: string | null; expires_at: string | null; is_active: boolean; }

export default function CouponManager({ coupons, couponTypes }: { coupons: Coupon[]; couponTypes: { value: string; label: string }[] }) {
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    const action = formData.get('_action') as string;
    if (action === 'delete') return adminDeleteCoupon(formData.get('id') as string);
    return adminCreateCoupon(formData);
  }, null);

  return (
    <>
      {state?.error && <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{state.error}</div>}
      {state?.success && <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">{state.success}</div>}

      <div className="bg-background-card rounded-2xl border border-border p-4 mb-6">
        <h3 className="font-medium mb-3">Add New Coupon</h3>
        <form action={formAction} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <input type="hidden" name="_action" value="create" />
          <Input id="coupon_code" name="code" label="Code" required />
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select name="type" className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm">
              {couponTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <Input id="coupon_value" name="value" type="number" step="0.01" label="Value" required />
          <Input id="coupon_min" name="min_order_amount" type="number" step="0.01" label="Min Order Amount" />
          <Input id="coupon_limit" name="usage_limit" type="number" label="Usage Limit" />
          <Input id="coupon_per_customer" name="per_customer_limit" type="number" label="Per Customer Limit" />
          <Input id="coupon_starts" name="starts_at" type="date" label="Starts At" />
          <Input id="coupon_expires" name="expires_at" type="date" label="Expires At" />
          <Button type="submit" isLoading={isPending}><Plus className="w-4 h-4 mr-1" /> Create</Button>
        </form>
      </div>

      <div className="bg-background-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Code</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Type</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Value</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} className="border-b border-border hover:bg-background-hover">
                <td className="px-4 py-3 text-sm font-mono font-bold">{c.code}</td>
                <td className="px-4 py-3 text-sm">{c.type}</td>
                <td className="px-4 py-3 text-sm">{c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${c.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form action={formAction} className="inline">
                    <input type="hidden" name="_action" value="delete" />
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="p-1 text-foreground-muted hover:text-error"><Trash2 className="w-4 h-4" /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <div className="text-center py-8 text-foreground-muted">No coupons yet</div>}
      </div>
    </>
  );
}
