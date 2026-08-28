'use client';

import { useState } from 'react';
import { MessageCircle, Check, Loader2 } from 'lucide-react';
import { adminUpdateCustomOrderStatus } from '@/lib/actions/admin-settings';
import Button from '@/components/ui/Button';
import { CUSTOM_ORDER_STATUSES } from '@/lib/constants';

type CustomOrderActionsProps = {
  orderId: string;
  currentStatus: string;
  customerName: string;
  customerWhatsApp: string;
  characterName: string;
};

export default function CustomOrderActions({
  orderId,
  currentStatus,
  customerName,
  customerWhatsApp,
  characterName,
}: CustomOrderActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const cleanPhone = customerWhatsApp.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0')
    ? `94${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('94')
    ? cleanPhone
    : `94${cleanPhone}`;

  const whatsappMessage = `Hi ${customerName}! 👋 This is MiniVersePrints regarding your custom 3D print request for "${characterName}".`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleUpdateStatus = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await adminUpdateCustomOrderStatus(orderId, selectedStatus);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert('Failed to update status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-60 flex-shrink-0 pt-4 lg:pt-0 lg:border-l lg:border-border lg:pl-6">
      {/* WhatsApp Message Customer */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
          <MessageCircle className="w-4 h-4 mr-1.5" /> Chat on WhatsApp
        </Button>
      </a>

      {/* Status Selector */}
      <div className="space-y-2 w-full">
        <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider block">
          Order Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {CUSTOM_ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          variant="outline"
          onClick={handleUpdateStatus}
          disabled={loading || selectedStatus === currentStatus}
          className="w-full text-xs"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
          ) : saved ? (
            <Check className="w-3.5 h-3.5 text-green-500 mr-1" />
          ) : null}
          {saved ? 'Updated!' : 'Save Status'}
        </Button>
      </div>
    </div>
  );
}
