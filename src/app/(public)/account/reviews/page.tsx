import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'My Reviews', description: 'Your product reviews' };

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: reviews } = await supabase.from('reviews').select('*').eq('user_id', user.id).order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Reviews' }]} />
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
      {!reviews?.length ? (
        <p className="text-foreground-muted">You have not written any reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-background-card rounded-2xl border border-border">
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={review.rating} size="sm" />
                {review.is_verified_purchase && <Badge variant="success">Verified</Badge>}
                {!review.is_approved && <Badge variant="warning">Pending</Badge>}
              </div>
              {review.title && <h3 className="font-medium">{review.title}</h3>}
              {review.body && <p className="text-sm text-foreground-muted mt-1">{review.body}</p>}
              <div className="text-xs text-foreground-muted mt-2">{formatDate(review.created_at)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
