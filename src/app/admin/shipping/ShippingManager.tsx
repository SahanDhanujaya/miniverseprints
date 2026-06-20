'use client';

import { useActionState } from 'react';
import { adminCreateShippingZone, adminDeleteShippingZone } from '@/lib/actions/admin-settings';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

interface Zone { id: string; name: string; districts: string[]; is_active: boolean; rates: { base_rate: number; per_kg_rate: number | null; free_delivery_threshold: number | null; estimated_days_min: number; estimated_days_max: number; rate_type: string }[]; }

export default function ShippingManager({ zones }: { zones: Zone[] }) {
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    const action = formData.get('_action') as string;
    if (action === 'delete') return adminDeleteShippingZone(formData.get('id') as string);
    return adminCreateShippingZone(formData);
  }, null);

  return (
    <>
      {state?.error && <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{state.error}</div>}
      {state?.success && <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">{state.success}</div>}

      <div className="bg-background-card rounded-2xl border border-border p-4 mb-6">
        <h3 className="font-medium mb-3">Add Shipping Zone</h3>
        <form action={formAction} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <input type="hidden" name="_action" value="create" />
          <Input id="zone_name" name="name" label="Zone Name" required />
          <div>
            <label className="block text-sm font-medium mb-1">Districts (comma-separated)</label>
            <input name="districts" placeholder="Colombo, Gampaha, Kalutara" className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm" />
          </div>
          <Input id="zone_base_rate" name="base_rate" type="number" step="0.01" label="Base Rate (LKR)" required />
          <Input id="zone_per_kg" name="per_kg_rate" type="number" step="0.01" label="Per KG Rate" />
          <Input id="zone_free_threshold" name="free_delivery_threshold" type="number" step="0.01" label="Free Delivery Above" />
          <Input id="zone_days_min" name="estimated_days_min" type="number" label="Min Days" defaultValue="1" />
          <Input id="zone_days_max" name="estimated_days_max" type="number" label="Max Days" defaultValue="3" />
          <Button type="submit" isLoading={isPending}><Plus className="w-4 h-4 mr-1" /> Add Zone</Button>
        </form>
      </div>

      <div className="space-y-4">
        {zones.map(zone => (
          <div key={zone.id} className="bg-background-card rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold">{zone.name}</h3>
                <p className="text-xs text-foreground-muted">{zone.districts.join(', ')}</p>
              </div>
              <form action={formAction} className="flex items-center gap-2">
                <input type="hidden" name="_action" value="delete" />
                <input type="hidden" name="id" value={zone.id} />
                <button type="submit" className="p-1 text-foreground-muted hover:text-error"><Trash2 className="w-4 h-4" /></button>
              </form>
            </div>
            {zone.rates?.[0] && (
              <div className="text-sm space-y-1">
                <p>Base Rate: <span className="font-medium">{formatPrice(zone.rates[0].base_rate)}</span></p>
                {zone.rates[0].per_kg_rate && <p>Per KG: {formatPrice(zone.rates[0].per_kg_rate)}</p>}
                {zone.rates[0].free_delivery_threshold && <p>Free above: {formatPrice(zone.rates[0].free_delivery_threshold)}</p>}
                <p className="text-foreground-muted">Est. delivery: {zone.rates[0].estimated_days_min}-{zone.rates[0].estimated_days_max} days</p>
              </div>
            )}
          </div>
        ))}
        {zones.length === 0 && <div className="text-center py-8 text-foreground-muted">No shipping zones</div>}
      </div>
    </>
  );
}
