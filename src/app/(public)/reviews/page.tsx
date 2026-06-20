import ReviewsShowcase from '@/components/reviews/ReviewsShowcase';
import { getPublicReviews } from '@/lib/reviews-data';

export const metadata = {
  title: 'Customer Reviews - MiniVersePrints',
  description: 'Read customer feedback for MiniVersePrints 3D-printed figures, miniatures, gifts, and collectibles.',
};

export const revalidate = 60;

export default async function ReviewsPage() {
  const reviews = await getPublicReviews();

  return <ReviewsShowcase reviews={reviews} />;
}
