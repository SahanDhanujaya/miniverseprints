import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import { KOOMBIYO_TRACKING_URL } from '@/lib/constants';
import { ExternalLink, Package } from 'lucide-react';

export const metadata = { title: 'Track Order', description: 'Track your MiniVersePrints order' };

export default function TrackOrderPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Track Order' }]} />
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>

      <div className="bg-background-card rounded-2xl border border-border p-8 text-center">
        <Package className="w-10 h-10 text-accent mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-2">Track your Koombiyo delivery</h2>
        <p className="text-foreground-muted text-sm mb-6">
          Use your Koombiyo waybill number to view the latest delivery status.
        </p>
        <a href={KOOMBIYO_TRACKING_URL} target="_blank" rel="noopener noreferrer">
          <Button size="lg">
            Koombiyo Waybill Tracking
            <ExternalLink className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}
