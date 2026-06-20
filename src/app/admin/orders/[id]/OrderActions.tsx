'use client';

import { useState } from 'react';
import { adminUpdateOrderStatus, adminVerifyBankPayment, adminAddTracking, adminAddOrderNote } from '@/lib/actions/admin-orders';
import { ORDER_STATUSES } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  payment?: any;
  adminNotes?: string | null;
}

export default function OrderActions({ orderId, currentStatus, payment, adminNotes }: OrderActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [note, setNote] = useState('');

  const handleStatusChange = async () => {
    await adminUpdateOrderStatus(orderId, selectedStatus);
  };

  const handleVerifyPayment = async () => {
    if (payment?.id) await adminVerifyBankPayment(orderId, payment.id);
  };

  const handleAddTracking = async () => {
    if (courier && trackingNumber) await adminAddTracking(orderId, courier, trackingNumber);
  };

  const handleAddNote = async () => {
    if (note) await adminAddOrderNote(orderId, note);
  };

  return (
    <div className="bg-background-card rounded-2xl border border-border p-4 space-y-4">
      <h2 className="font-bold">Actions</h2>

      {/* Change status */}
      <div>
        <label className="block text-sm font-medium mb-1">Change Status</label>
        <div className="flex gap-2">
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm">
            {ORDER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <Button size="sm" onClick={handleStatusChange}>Update</Button>
        </div>
      </div>

      {/* Verify bank payment */}
      {payment?.method === 'bank_transfer' && payment?.status !== 'verified' && (
        <div>
          <Button size="sm" variant="outline" onClick={handleVerifyPayment} className="w-full">
            Verify Bank Payment
          </Button>
        </div>
      )}

      {/* Add tracking */}
      <div>
        <label className="block text-sm font-medium mb-1">Add Tracking</label>
        <Input value={courier} onChange={e => setCourier(e.target.value)} placeholder="Courier name" className="mb-2" />
        <Input value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Tracking number" className="mb-2" />
        <Button size="sm" onClick={handleAddTracking} disabled={!courier || !trackingNumber} className="w-full">
          Add Tracking & Dispatch
        </Button>
      </div>

      {/* Admin note */}
      <div>
        <label className="block text-sm font-medium mb-1">Admin Note</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." rows={2} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm mb-2" />
        <Button size="sm" variant="outline" onClick={handleAddNote} disabled={!note} className="w-full">
          Save Note
        </Button>
      </div>
    </div>
  );
}
