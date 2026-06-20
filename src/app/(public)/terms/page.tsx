import Breadcrumb from '@/components/ui/Breadcrumb';
export const metadata = { title: 'Terms & Conditions', description: 'Terms and conditions' };
export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground-muted">
        <p>By using MiniVersePrints, you agree to these terms and conditions.</p>
        <h2 className="text-foreground">Orders</h2>
        <p>All orders are subject to availability. We reserve the right to cancel orders due to stock issues or pricing errors.</p>
        <h2 className="text-foreground">Pricing</h2>
        <p>All prices are in Sri Lankan Rupees (LKR). Prices may change without notice.</p>
        <h2 className="text-foreground">Made-to-Order Products</h2>
        <p>Made-to-order products require production time. Delivery estimates are approximate and may vary.</p>
        <h2 className="text-foreground">Payments</h2>
        <p>Payments are processed securely through our payment partners. We do not store your card details.</p>
      </div>
    </div>
  );
}
