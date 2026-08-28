import Link from 'next/link';
import { CheckCircle2, ExternalLink, Star, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { PublicReview } from '@/lib/reviews-data';
import Button from '@/components/ui/Button';
import { GOOGLE_REVIEWS_LINK } from '@/lib/constants';

type ReviewsShowcaseProps = {
  reviews: PublicReview[];
  compact?: boolean;
};

export default function ReviewsShowcase({ reviews, compact = false }: ReviewsShowcaseProps) {
  return (
    <section className={compact ? 'max-w-7xl mx-auto px-4 sm:px-6 py-10' : 'max-w-7xl mx-auto px-4 sm:px-6 py-12'}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5E3D3] text-[#A34E17] text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            Customer Feedback
          </div>
          <h2 className={compact ? 'font-serif text-3xl font-bold text-[#1F150E]' : 'font-serif text-3xl md:text-5xl font-bold text-[#1F150E]'}>
            Loved By Sri Lankan Collectors
          </h2>
          <p className="text-[#6E5A4B] text-sm mt-1 max-w-2xl">
            Real feedback for MiniVersePrints figures, custom gifts, desk pieces, and bespoke 3D-printed orders.
          </p>
        </div>
        {compact && (
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/reviews" className="text-[#A34E17] hover:underline text-xs font-bold uppercase tracking-wider">
              View all reviews
            </Link>
            <a
              href={GOOGLE_REVIEWS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#A34E17] hover:underline uppercase tracking-wider"
            >
              Google reviews <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <article key={review.id} className="bg-[#FAF6F0] border border-[#D5C5B5] rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-1 text-amber-500" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${index < review.rating ? 'fill-current text-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    {review.source === 'google' ? 'Google' : 'Verified'}
                  </span>
                )}
              </div>
              <h3 className="font-serif font-bold text-base text-[#1F150E] mb-2">{review.title}</h3>
              <p className="text-[#6E5A4B] text-xs leading-relaxed mb-4">&ldquo;{review.body}&rdquo;</p>
              {review.adminReply && (
                <div className="mb-4 rounded-2xl border border-[#D5C5B5] bg-[#EFE7DC] p-3 text-xs">
                  <span className="text-[#A34E17] font-bold">MiniVersePrints reply:</span> {review.adminReply}
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-[#D5C5B5]">
              <p className="font-bold text-xs text-[#1F150E]">{review.customerName}</p>
              <Link href="/gallery" className="text-xs text-[#A34E17] hover:underline flex items-center gap-1 mt-0.5 font-bold">
                <ImageIcon className="w-3 h-3" /> {review.productName || '3D Printed Collectible'}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!compact && (
        <div className="mt-12 bg-[#FAF6F0] border border-[#D5C5B5] rounded-3xl p-8 text-center shadow-xs">
          <h2 className="font-serif text-2xl font-bold text-[#1F150E] mb-2">Ready To Make Yours?</h2>
          <p className="text-[#6E5A4B] text-xs max-w-md mx-auto mb-6">Browse our completed gallery works or send your custom reference through the order form.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/gallery">
              <Button className="bg-[#A34E17] hover:bg-[#853D10] text-white font-bold">
                <ImageIcon className="w-4 h-4 mr-1.5" /> Browse Gallery
              </Button>
            </Link>
            <Link href="/custom-order">
              <Button variant="outline" className="border-[#D5C5B5] text-[#1F150E]">
                <Sparkles className="w-4 h-4 mr-1.5 text-[#A34E17]" /> Custom Order
              </Button>
            </Link>
            <a href={GOOGLE_REVIEWS_LINK} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-[#D5C5B5] text-[#1F150E]">
                Google Reviews <ExternalLink className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
