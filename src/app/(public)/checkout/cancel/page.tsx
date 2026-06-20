import Link from 'next/link';

export const metadata = { title: 'Payment Cancelled', description: 'Payment was cancelled' };
export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-foreground-muted mb-6">Your payment was cancelled. Your order is still pending.</p>
      <div className="flex gap-3 justify-center">
        <Link href="/account/orders" className="text-accent hover:underline">View Orders</Link>
        <Link href="/cart" className="text-accent hover:underline">Return to Cart</Link>
      </div>
    </div>
  );
}
