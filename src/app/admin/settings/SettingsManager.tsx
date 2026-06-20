'use client';

import { useActionState } from 'react';
import { adminUpdateSetting, adminCreateBankDetail, adminUpdateBankDetail } from '@/lib/actions/admin-settings';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Save, Plus } from 'lucide-react';

interface Setting { id: string; key: string; value: string; }
interface BankDetail { id: string; bank_name: string; account_name: string; account_number: string; branch: string | null; is_active: boolean; }

export default function SettingsManager({ settings, bankDetails }: { settings: Setting[]; bankDetails: BankDetail[] }) {
  const [state, formAction, isPending] = useActionState(async (_prev: any, formData: FormData) => {
    const action = formData.get('_action') as string;
    if (action === 'setting') {
      const key = formData.get('key') as string;
      const value = formData.get('value') as string;
      return adminUpdateSetting(key, value);
    }
    if (action === 'bank') return adminCreateBankDetail(formData);
    if (action === 'bank_update') return adminUpdateBankDetail(formData.get('id') as string, formData);
    return { error: 'Unknown action.' };
  }, null);

  return (
    <>
      {state?.error && <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm">{state.error}</div>}
      {state?.success && <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success text-sm">{state.success}</div>}

      {/* Site Settings */}
      <div className="bg-background-card rounded-2xl border border-border p-4 mb-6">
        <h2 className="font-bold mb-4">Site Settings</h2>
        <div className="space-y-3">
          {settings.map(setting => (
            <form key={setting.id} action={formAction} className="flex items-center gap-3">
              <input type="hidden" name="_action" value="setting" />
              <input type="hidden" name="key" value={setting.key} />
              <span className="text-sm font-medium min-w-[200px]">{setting.key}</span>
              <input name="value" defaultValue={setting.value} className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm" />
              <Button size="sm" type="submit"><Save className="w-4 h-4" /></Button>
            </form>
          ))}
          {settings.length === 0 && <p className="text-sm text-foreground-muted">No settings configured</p>}
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-background-card rounded-2xl border border-border p-4">
        <h2 className="font-bold mb-4">Bank Details</h2>
        <div className="space-y-4 mb-6">
          {bankDetails.map(bank => (
            <form key={bank.id} action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border border-border rounded-xl">
              <input type="hidden" name="_action" value="bank_update" />
              <input type="hidden" name="id" value={bank.id} />
              <Input name="bank_name" label="Bank Name" defaultValue={bank.bank_name} />
              <Input name="account_name" label="Account Name" defaultValue={bank.account_name} />
              <Input name="account_number" label="Account Number" defaultValue={bank.account_number} />
              <Input name="branch" label="Branch" defaultValue={bank.branch || ''} />
              <Button type="submit" size="sm"><Save className="w-4 h-4 mr-1" /> Save</Button>
            </form>
          ))}
        </div>

        <h3 className="font-medium mb-3">Add Bank Account</h3>
        <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
          <input type="hidden" name="_action" value="bank" />
          <Input name="bank_name" label="Bank Name" required />
          <Input name="account_name" label="Account Name" required />
          <Input name="account_number" label="Account Number" required />
          <Input name="branch" label="Branch" />
          <Button type="submit" isLoading={isPending}><Plus className="w-4 h-4 mr-1" /> Add Bank</Button>
        </form>
      </div>
    </>
  );
}
