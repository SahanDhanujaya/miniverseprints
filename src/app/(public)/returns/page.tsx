import Breadcrumb from '@/components/ui/Breadcrumb';
export const metadata = { title: 'Returns & Refunds', description: 'Returns and refund policy' };
export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Returns & Refunds' }]} />
      <h1 className="text-3xl font-bold mb-6">Returns & Refund Policy</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground-muted">
        <h2 className="text-foreground">Returns</h2>
        <p>We accept returns within 7 days of delivery if the product is damaged or defective. Please contact us via WhatsApp with photos of the issue.</p>
        <h2 className="text-foreground">Refunds</h2>
        <p>Refunds are processed within 5-7 business days after we receive and inspect the returned item. Refunds are issued to the original payment method.</p>
        <h2 className="text-foreground">Custom Orders</h2>
        <p>Custom-made products cannot be returned unless they arrive damaged or differ significantly from the agreed specifications.</p>
      </div>
    </div>
  );
}
