'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Flag, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  admin_reply?: string | null;
  admin_reply_at?: string | null;
  created_at: string;
  user: { first_name: string | null; last_name: string | null } | null;
}

export default function ProductReviews({ reviews, productId }: { reviews: Review[]; productId: string }) {
  const approved = reviews.filter(r => r.is_approved);

  if (approved.length === 0) {
    return (
      <div className="text-center py-8 text-foreground-muted">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  const avgRating = approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
          <div className="flex items-center justify-center mt-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-foreground-muted'}`} />
            ))}
          </div>
          <p className="text-xs text-foreground-muted mt-1">{approved.length} reviews</p>
        </div>
      </div>

      <div className="space-y-4">
        {approved.map(review => (
          <div key={review.id} className="p-4 bg-background-card rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-foreground-muted'}`} />
                  ))}
                </div>
                {review.is_verified_purchase && (
                  <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <span className="text-xs text-foreground-muted">{formatDate(review.created_at)}</span>
            </div>
            {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
            {review.body && <p className="text-sm text-foreground-muted">{review.body}</p>}
            {review.admin_reply && (
              <div className="mt-3 p-3 bg-accent/5 border-l-2 border-accent rounded-r-lg">
                <div className="text-xs font-medium text-accent mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> MiniVersePrints Reply
                </div>
                <p className="text-sm">{review.admin_reply}</p>
              </div>
            )}
            <div className="mt-2 text-right">
              <button className="text-xs text-foreground-muted hover:text-accent flex items-center gap-1 ml-auto">
                <Flag className="w-3 h-3" /> Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
