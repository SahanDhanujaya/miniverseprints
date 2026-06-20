import { createClient } from '@/lib/supabase/server';
import { GOOGLE_REVIEW_SEARCH_QUERY } from '@/lib/constants';
import { hasSupabaseConfig } from '@/lib/supabase/config';

export type PublicReview = {
  id: string;
  customerName: string;
  productName: string;
  productSlug?: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
  adminReply?: string | null;
  source?: 'site' | 'google';
  authorPhotoUrl?: string | null;
  externalUrl?: string | null;
};

export const demoPublicReviews: PublicReview[] = [
  {
    id: 'demo-review-1',
    customerName: 'Nethmi P.',
    productName: 'Valentine Rose',
    productSlug: 'valentine-rose',
    rating: 5,
    title: 'Beautiful gift quality',
    body: 'The finish looked premium and the gift packaging felt really special. It was ready faster than I expected.',
    verified: true,
    createdAt: '2026-05-28',
  },
  {
    id: 'demo-review-2',
    customerName: 'Kavindu S.',
    productName: 'Controller Holder',
    productSlug: 'controller-holder',
    rating: 5,
    title: 'Perfect for my setup',
    body: 'Solid print, clean paint work, and it looks great on my gaming desk. The holder feels sturdy with the controller on it.',
    verified: true,
    createdAt: '2026-05-22',
  },
  {
    id: 'demo-review-3',
    customerName: 'Ayesha R.',
    productName: 'Customized Lithoplane Lamp',
    productSlug: 'customized-lithoplane-lamp',
    rating: 5,
    title: 'The photo detail was amazing',
    body: 'The photo detail came through beautifully when the light was on. Perfect custom gift.',
    verified: true,
    createdAt: '2026-05-17',
  },
  {
    id: 'demo-review-4',
    customerName: 'Dinuka M.',
    productName: 'Anime Keychains',
    productSlug: 'anime-keychains',
    rating: 5,
    title: 'Clean and colourful',
    body: 'Ordered a few designs for friends. The colours were sharp and everyone loved them.',
    verified: true,
    createdAt: '2026-05-09',
  },
  {
    id: 'demo-review-5',
    customerName: 'Sachini W.',
    productName: 'Cat Ornament',
    productSlug: 'cat-ornament',
    rating: 5,
    title: 'Looks classy on my shelf',
    body: 'Minimal, clean, and exactly the style I wanted for my shelf. The black finish looks classy.',
    verified: true,
    createdAt: '2026-04-30',
  },
  {
    id: 'demo-review-6',
    customerName: 'Hasitha J.',
    productName: 'MK1 Headset Stand',
    productSlug: 'mk1-headset-stand',
    rating: 5,
    title: 'Better in person',
    body: 'The stand is much better in person. Great detail and it keeps my desk tidy.',
    verified: true,
    createdAt: '2026-04-21',
  },
];

type ReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  admin_reply: string | null;
  product: { name: string; slug: string } | null;
  user: { first_name: string | null; last_name: string | null } | null;
};

type GooglePlaceSummary = {
  id: string;
  displayName?: { text?: string };
};

type GoogleReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  publishTime?: string;
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
    uri?: string;
  };
};

type GooglePlaceDetails = {
  id?: string;
  displayName?: { text?: string };
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  reviews?: GoogleReview[];
};

function getCustomerName(review: ReviewRow) {
  const firstName = review.user?.first_name?.trim();
  const lastInitial = review.user?.last_name?.trim()?.[0];

  if (firstName && lastInitial) return `${firstName} ${lastInitial}.`;
  if (firstName) return firstName;

  return 'MiniVersePrints Customer';
}

function getGoogleApiKey() {
  return process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
}

async function resolveGooglePlaceId(apiKey: string) {
  const configuredPlaceId = process.env.GOOGLE_PLACE_ID;
  if (configuredPlaceId) {
    return configuredPlaceId.startsWith('places/') ? configuredPlaceId : `places/${configuredPlaceId}`;
  }

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName',
    },
    body: JSON.stringify({
      textQuery: process.env.GOOGLE_PLACE_SEARCH_QUERY || GOOGLE_REVIEW_SEARCH_QUERY,
      maxResultCount: 1,
    }),
    next: { revalidate: 60 * 60 * 6 },
  });

  if (!response.ok) return null;

  const data = await response.json() as { places?: GooglePlaceSummary[] };
  const placeId = data.places?.[0]?.id;
  return placeId ? `places/${placeId}` : null;
}

async function getGooglePublicReviews(limit?: number): Promise<PublicReview[]> {
  const apiKey = getGoogleApiKey();
  if (!apiKey) return [];

  try {
    const placeId = await resolveGooglePlaceId(apiKey);
    if (!placeId) return [];

    const fields = [
      'id',
      'displayName',
      'googleMapsUri',
      'rating',
      'userRatingCount',
      'reviews',
    ].join(',');

    const response = await fetch(`https://places.googleapis.com/v1/${placeId}?fields=${fields}&key=${apiKey}`, {
      next: { revalidate: 60 * 60 * 6 },
    });

    if (!response.ok) return [];

    const place = await response.json() as GooglePlaceDetails;
    const reviews = place.reviews || [];

    return reviews.slice(0, limit || reviews.length).map((review, index) => {
      const body = review.text?.text || review.originalText?.text || 'Reviewed MiniVersePrints on Google.';

      return {
        id: review.name || `google-review-${index}`,
        customerName: review.authorAttribution?.displayName || 'Google reviewer',
        productName: place.displayName?.text || 'MiniVersePrints',
        rating: Math.max(1, Math.min(5, Math.round(review.rating || 5))),
        title: 'Google customer review',
        body,
        verified: true,
        createdAt: review.publishTime || review.relativePublishTimeDescription || '',
        source: 'google',
        authorPhotoUrl: review.authorAttribution?.photoUri || null,
        externalUrl: review.authorAttribution?.uri || place.googleMapsUri || null,
      };
    });
  } catch {
    return [];
  }
}

export async function getPublicReviews(limit?: number): Promise<PublicReview[]> {
  const googleReviews = await getGooglePublicReviews(limit);
  if (googleReviews.length) return googleReviews;

  if (!hasSupabaseConfig()) {
    return limit ? demoPublicReviews.slice(0, limit) : demoPublicReviews;
  }

  const supabase = await createClient();
  const query = supabase
    .from('reviews')
    .select(`
      id,
      rating,
      title,
      body,
      is_verified_purchase,
      created_at,
      admin_reply,
      product:products(name, slug),
      user:profiles(first_name, last_name)
    `)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  const { data, error } = await (limit ? query.limit(limit) : query);

  if (error || !data?.length) {
    return limit ? demoPublicReviews.slice(0, limit) : demoPublicReviews;
  }

  return (data as unknown as ReviewRow[]).map((review) => ({
    id: review.id,
    customerName: getCustomerName(review),
    productName: review.product?.name || 'MiniVersePrints Product',
    productSlug: review.product?.slug,
    rating: review.rating,
    title: review.title || `${review.rating}-star customer review`,
    body: review.body || 'Loved the final 3D-printed piece from MiniVersePrints.',
    verified: review.is_verified_purchase,
    createdAt: review.created_at,
    adminReply: review.admin_reply,
  }));
}
