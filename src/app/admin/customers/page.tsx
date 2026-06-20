import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatDateTime } from '@/lib/utils';

export const metadata = { title: 'Customers - Admin' };

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, phone, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <div className="bg-background-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Phone</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-foreground-muted">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(customers || []).map((c: any) => (
                <tr key={c.id} className="border-b border-border hover:bg-background-hover transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{c.first_name} {c.last_name}</td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">{c.phone || '-'}</td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">{formatDateTime(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!customers || customers.length === 0) && <div className="text-center py-12 text-foreground-muted">No customers yet</div>}
      </div>
    </div>
  );
}
