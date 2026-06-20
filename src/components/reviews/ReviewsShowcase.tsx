import Link from 'next/link';
import { CheckCircle2, ExternalLink, Star } from 'lucide-react';
import type { PublicReview } from '@/lib/reviews-data';
import Button from '@/components/ui/Button';
import { GOOGLE_REVIEWS_LINK } from '@/lib/constants';

type ReviewsShowcaseProps = {
  reviews: PublicReview[];
  compact?: boolean;
};

export default function ReviewsShowcase({ reviews, compact = false }: ReviewsShowcaseProps) {
  return (
    <section className={compact ? 'reveal-on-scroll max-w-7xl mx-auto px-4 py-14' : 'max-w-7xl mx-auto px-4 py-12'}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent-light text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            Customer reviews
          </div>
          <h2 className={compact ? 'text-2xl font-bold' : 'text-4xl md:text-5xl font-bold'}>
            Loved By Local Collectors
          </h2>
          <p className="text-foreground-muted mt-3 max-w-2xl">
            Real feedback for MiniVersePrints figures, gifts, desk pieces, and custom 3D-printed orders.
          </p>
        </div>
        {compact && (
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/reviews" className="text-accent hover:underline text-sm font-medium">
              View all reviews
            </Link>
            <a
              href={GOOGLE_REVIEWS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Google reviews <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((review) => (
          <article key={review.id} className="reveal-on-scroll hover-lift bg-background-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-1 text-warning" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${index < review.rating ? 'fill-current' : 'text-border-light'}`}
                  />
                ))}
              </div>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-xs text-success">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {review.source === 'google' ? 'Google' : 'Verified'}
                </span>
              )}
            </div>
            <h3 className="font-semibold mb-2">{review.title}</h3>
            <p className="text-foreground-muted mb-5 leading-relaxed">"{review.body}"</p>
            {review.adminReply && (
              <div className="mb-5 rounded-xl border border-accent/20 bg-accent/5 p-3 text-sm">
                <span className="text-accent-light font-medium">MiniVersePrints reply:</span> {review.adminReply}
              </div>
            )}
            <div>
              <p className="font-semibold">{review.customerName}</p>
              {review.productSlug ? (
                <Link href={`/product/${review.productSlug}`} className="text-sm text-accent-light hover:underline">
                  {review.productName}
                </Link>
              ) : (
                <p className="text-sm text-accent-light">{review.productName}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {!compact && (
        <div className="reveal-on-scroll mt-10 bg-background-secondary border border-border rounded-2xl px-6 py-8 text-center hover-lift">
          <h2 className="text-2xl font-bold mb-2">Ready To Make Yours?</h2>
          <p className="text-foreground-muted mb-6">Choose a product or send your custom reference through the order form.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/shop">
              <Button className="magnetic-button">Browse Products</Button>
            </Link>
            <Link href="/custom-order">
              <Button variant="outline" className="magnetic-button">Custom Order</Button>
            </Link>
            <a href={GOOGLE_REVIEWS_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="magnetic-button">
                Google Reviews <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
