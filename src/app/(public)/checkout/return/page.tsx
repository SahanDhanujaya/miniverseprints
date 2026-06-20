import Link from 'next/link';

export const metadata = { title: 'Payment Return', description: 'Payment return page' };
export default function PaymentReturnPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Processing</h1>
      <p className="text-foreground-muted mb-6">Your payment is being processed. You will receive a confirmation shortly.</p>
      <Link href="/account/orders" className="text-accent hover:underline">View your orders</Link>
    </div>
  );
}
