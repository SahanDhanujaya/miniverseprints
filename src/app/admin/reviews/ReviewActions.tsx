'use client';

import { useState } from 'react';
import { adminApproveReview, adminRejectReview, adminReplyReview } from '@/lib/actions/admin-settings';
import Button from '@/components/ui/Button';

export default function ReviewActions({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState('');

  const handleReply = async () => {
    if (reply) {
      await adminReplyReview(reviewId, reply);
      setReply('');
      setReplyOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 ml-4 flex-shrink-0">
      {!isApproved && (
        <>
          <Button size="sm" onClick={() => adminApproveReview(reviewId)}>Approve</Button>
          <Button size="sm" variant="outline" onClick={() => adminRejectReview(reviewId)}>Reject</Button>
        </>
      )}
      <Button size="sm" variant="ghost" onClick={() => setReplyOpen(!replyOpen)}>
        Reply
      </Button>
      {replyOpen && (
        <div className="space-y-2">
          <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Write reply..." rows={2} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
          <Button size="sm" onClick={handleReply} disabled={!reply}>Send Reply</Button>
        </div>
      )}
    </div>
  );
}
