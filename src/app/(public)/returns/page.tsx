import Breadcrumb from '@/components/ui/Breadcrumb';
export const metadata = { title: 'Returns & Refunds', description: 'Returns and refund policy' };
export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Returns & Refunds' }]} />
      <h1 className="text-3xl font-bold mb-6">Returns & Refund Policy</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground-muted">
        <h2 className="text-foreground">Custom Orders</h2>
        <p>Custom-made products cannot be returned.</p>
      </div>
    </div>
  );
}
