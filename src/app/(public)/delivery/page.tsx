import Breadcrumb from '@/components/ui/Breadcrumb';
import { CURRENCY_SYMBOL } from '@/lib/constants';
export const metadata = { title: 'Delivery Information', description: 'Delivery information for MiniVersePrints' };
export default function DeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Delivery Information' }]} />
      <h1 className="text-3xl font-bold mb-6">Delivery Information</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground-muted">
        <p>We deliver across Sri Lanka. Delivery charges and estimated times vary by location.</p>
        <h2 className="text-foreground">Delivery Zones</h2>
        <table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-2">Zone</th><th className="text-left py-2">Charge</th><th className="text-left py-2">Est. Days</th></tr></thead><tbody>
          <tr className="border-b border-border"><td className="py-2">Colombo District</td><td>{CURRENCY_SYMBOL} 450</td><td>2-4</td></tr>
          <tr className="border-b border-border"><td className="py-2">Western Province</td><td>{CURRENCY_SYMBOL} 450</td><td>2-4</td></tr>
          <tr><td className="py-2">Other Provinces</td><td>{CURRENCY_SYMBOL} 500</td><td>3-5</td></tr>
        </tbody></table>
        <h2 className="text-foreground">Made-to-Order Items</h2>
        <p>Made-to-order items require additional production time (typically 4-7 days) before dispatch. The estimated delivery time is in addition to the production lead time.</p>
      </div>
    </div>
  );
}
