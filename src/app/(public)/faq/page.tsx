import Breadcrumb from '@/components/ui/Breadcrumb';
export const metadata = { title: 'FAQ', description: 'Frequently asked questions' };
const faqs = [
  { q: 'How long does delivery take?', a: 'Ready-stock items are dispatched within 1-2 days. Made-to-order items take 7-14 days for production, plus delivery time.' },
  { q: 'Do you deliver island-wide?', a: 'Yes, we deliver across all districts in Sri Lanka. Delivery charges vary by location.' },
  { q: 'Can I customise a figure?', a: 'Yes! Use our Custom Order form to request a personalised figure with your specifications.' },
  { q: 'What payment methods do you accept?', a: 'We accept PayHere online payments, cash on delivery, bank transfers, and store pickup.' },
  { q: 'How do I track my order?', a: 'Use our Track Order page with your order number and email address.' },
  { q: 'Can I return a product?', a: 'Returns are accepted within 7 days for damaged or defective items. Contact us via WhatsApp.' },
  { q: 'What materials do you use?', a: 'We use premium PLA+ filament for 3D printing, ensuring durability and fine detail.' },
  { q: 'Do you offer painted figures?', a: 'Yes, most figures are available painted or unpainted. Painted options are hand-finished for maximum detail.' },
];
export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'FAQ' }]} />
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="group bg-background-card rounded-2xl border border-border">
            <summary className="p-4 cursor-pointer font-medium hover:text-accent transition-colors">{faq.q}</summary>
            <div className="px-4 pb-4 text-sm text-foreground-muted">{faq.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
