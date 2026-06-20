'use client';

import { useState } from 'react';
import { adminUpdateCustomOrderStatus, adminSubmitCustomOrderQuotation } from '@/lib/actions/admin-settings';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CUSTOM_ORDER_STATUSES } from '@/lib/constants';

export default function CustomOrderActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [quotationPrice, setQuotationPrice] = useState('');
  const [quotationNotes, setQuotationNotes] = useState('');

  return (
    <div className="flex flex-col gap-2 ml-4 flex-shrink-0 min-w-[200px]">
      <div>
        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm mb-1">
          {CUSTOM_ORDER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <Button size="sm" onClick={() => adminUpdateCustomOrderStatus(orderId, selectedStatus)} className="w-full">Update Status</Button>
      </div>
      {currentStatus === 'reviewing' && (
        <div>
          <Input value={quotationPrice} onChange={e => setQuotationPrice(e.target.value)} type="number" step="0.01" placeholder="Quotation price (LKR)" className="mb-1" />
          <Input value={quotationNotes} onChange={e => setQuotationNotes(e.target.value)} placeholder="Notes" className="mb-1" />
          <Button size="sm" variant="outline" onClick={() => quotationPrice && adminSubmitCustomOrderQuotation(orderId, parseFloat(quotationPrice), quotationNotes)} className="w-full" disabled={!quotationPrice}>
            Send Quotation
          </Button>
        </div>
      )}
    </div>
  );
}
