import { createClient } from '@/lib/supabase/server';
import { formatDateTime } from '@/lib/utils';
import ReviewActions from './ReviewActions';

export const metadata = { title: 'Reviews - Admin' };

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, product:products(id, name, slug), user:profiles(first_name, last_name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reviews</h1>
      <div className="space-y-4">
        {(reviews || []).map((review: any) => (
          <div key={review.id} className="bg-background-card rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className={`text-sm ${s <= review.rating ? 'text-yellow-400' : 'text-foreground-muted'}`}>★</span>
                    ))}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${review.is_approved ? 'bg-success/10 text-success' : 'bg-yellow-400/10 text-yellow-400'}`}>
                    {review.is_approved ? 'Approved' : 'Pending'}
                  </span>
                  {review.is_verified_purchase && <span className="text-xs bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded-full">Verified Purchase</span>}
                </div>
                <p className="text-sm font-medium">{review.product?.name || 'Unknown Product'}</p>
                <p className="text-xs text-foreground-muted">by {review.user?.first_name || 'Unknown'} {review.user?.last_name || ''} - {formatDateTime(review.created_at)}</p>
                {review.title && <p className="text-sm font-medium mt-1">{review.title}</p>}
                {review.body && <p className="text-sm text-foreground-muted mt-1">{review.body}</p>}
                {review.admin_reply && (
                  <div className="mt-2 p-2 bg-accent/5 border-l-2 border-accent rounded-r-lg text-sm">
                    <span className="text-xs font-medium text-accent">Admin Reply:</span> {review.admin_reply}
                  </div>
                )}
              </div>
              <ReviewActions reviewId={review.id} isApproved={review.is_approved} />
            </div>
          </div>
        ))}
        {(!reviews || reviews.length === 0) && <div className="text-center py-12 text-foreground-muted">No reviews yet</div>}
      </div>
    </div>
  );
}
