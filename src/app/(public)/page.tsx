import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Video, Send } from 'lucide-react';
import ProductCarousel from '@/components/product/ProductCarousel';
import ReviewsShowcase from '@/components/reviews/ReviewsShowcase';
import { WHATSAPP_LINK } from '@/lib/constants';
import { Product, Category } from '@/types';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { demoCategories, demoProducts } from '@/lib/demo-store';
import { demoPublicReviews, getPublicReviews, PublicReview } from '@/lib/reviews-data';
import ScrollFX from '@/components/motion/ScrollFx';
import Magnetic from '@/components/motion/Magnetic';
import Cursor from '@/components/motion/Cursor';
import HeroSequence from '@/components/HeroSequence';
import SectionContent from '@/components/motion/SectionContent';
import ScrollSlideX from '@/components/motion/ScrollSlideX';
import PerspectiveCarousel from '@/components/product/PerspectiveCarousel';
import ScrollFlipSection from '@/components/motion/ScrollFlipSection';
import ScrollSlideLeftToRight from '@/components/motion/ScrollSlideLeftToRight';
import ScrollSlideRightToLeft from '@/components/motion/ScrollSlideRightToLeft';
import ScrollSlideBottomToTop from '@/components/motion/ScrollSlideBottomToTop';

export const revalidate = 60;

function getDemoHomeData() {
  return {
    featured: demoProducts.filter((product) => product.is_featured),
    newArrivals: demoProducts.filter((product) => product.is_new_arrival),
    bestSellers: demoProducts.filter((product) => product.is_best_seller),
    categories: demoCategories,
    banners: [],
    reviews: demoPublicReviews.slice(0, 3),
  };
}

async function getHomeData() {
  if (!hasSupabaseConfig()) {
    return getDemoHomeData();
  }

  const supabase = await createClient();

  const [featured, newArrivals, bestSellers, categories, banners, reviews] = await Promise.all([
    supabase.from('products').select('*, product_images(*)').eq('is_featured', true).eq('is_active', true).limit(24),
    supabase.from('products').select('*, product_images(*)').eq('is_new_arrival', true).eq('is_active', true).limit(24),
    supabase.from('products').select('*, product_images(*)').eq('is_best_seller', true).eq('is_active', true).limit(24),
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order').limit(12),
    supabase.from('homepage_banners').select('*').eq('is_active', true).order('sort_order').limit(5),
    getPublicReviews(3),
  ]);

  if (featured.error || newArrivals.error || bestSellers.error || categories.error) {
    return {
      ...getDemoHomeData(),
      reviews,
    };
  }

  return {
    featured: (featured.data || []) as Product[],
    newArrivals: (newArrivals.data || []) as Product[],
    bestSellers: (bestSellers.data || []) as Product[],
    categories: (categories.data || []) as Category[],
    banners: banners.data || [],
    reviews,
  };
}

export default async function HomePage() {
  const { featured, newArrivals, bestSellers, categories, banners, reviews } = await getHomeData();

  const craftPoints = [
    {
      iconName: 'Layers',
      title: 'Micron-Level Layer Resolution',
      desc: 'Ultra-crisp detail retention even on intricate anime facial features.',
    },
    {
      iconName: 'Sparkles',
      title: 'Hand-Painted Finishing',
      desc: 'Custom shade palettes, airbrushing, and protective matte or glossy coats.',
    },
  ];

  const process = [
    { iconName: 'Compass', title: 'Discover', desc: 'Browse the collection, or share a reference for a piece that doesn’t exist yet' },
    { iconName: 'MessageCircle', title: 'Consult', desc: 'We talk through scale, finish, and detail together before anything is made' },
    { iconName: 'Palette', title: 'Create', desc: 'Your piece is sculpted, cast, and hand-painted in the atelier' },
    { iconName: 'Shield', title: 'Deliver', desc: 'Each piece is inspected under studio light before it leaves us' },
  ];

  return (
    <div className="relative bg-black overflow-x-clip">
      {/* Scroll FX progress bar + cursor */}
      <ScrollFX />
      <Cursor />

      {/* ═══════════════════════════════════════════════════════
          HERO — scroll-scrubbing car frame sequence
      ═══════════════════════════════════════════════════════ */}
      <HeroSequence />

      {/*
        All section animations below use SectionContent (a client component
        that wraps framer-motion). The parent <section> layout is NEVER touched.
        Only the inner glass cards, text groups, and grids are animated.
      */}

      {/* ═══════════════════════════════════════════════════════
          SCROLL-SCRUBBED 3D FLIP: GALLERY ➔ CRAFTSMANSHIP
      ═══════════════════════════════════════════════════════ */}
      <ScrollFlipSection
        galleryContent={
          <ScrollSlideX>
            <section id="gallery" className="py-10">
              <SectionContent
                eyebrow="Selected Works"
                heading="From the Collection"
                subtext="Each piece shown here is available to view in 3D, or to enquire about as a one-of-one commission."
              >
                {featured.length > 0 && (
                  <div className="-mx-6 md:-mx-10">
                    <PerspectiveCarousel products={featured} />
                  </div>
                )}
              </SectionContent>
            </section>
          </ScrollSlideX>
        }
        craftsmanshipContent={
          <section className="py-10 w-full">
            <div className="max-w-7xl mx-auto px-4">
              <SectionContent
                eyebrow="Craftsmanship"
                heading="From Digital Sculpts to Physical Masterpieces"
                subtext="Every model is meticulously cured, sanded, primed, and hand-painted by our artisans — transforming a digital sculpt into a durable, museum-grade work you can hold."
                twoCol
                leftContent={
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src="/process-preview.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium border border-white/10 flex items-center gap-2 text-zinc-300">
                      <Video className="w-4 h-4 text-zinc-400" /> Inside the Atelier
                    </div>
                  </div>
                }
                craftPoints={craftPoints}
              />
            </div>
          </section>
        }
      />
      {/* ═══════════════════════════════════════════════════════
          COMMISSIONS CTA
      ═══════════════════════════════════════════════════════ */}
      <ScrollSlideLeftToRight>
        <section className="max-w-7xl mx-auto px-4 py-20">
          <SectionContent
            variant="cta"
            eyebrow="Begin a Commission"
            heading="Commission an Original Piece"
            subtext={
              <>
                Have something in mind that isn&apos;t in the collection? Share reference photos or your own 3D files (<code className="text-zinc-300">.STL</code>, <code className="text-zinc-300">.OBJ</code>) and our atelier will bring it to life.
              </>
            }
            ctaActions={
              <div className="flex flex-wrap justify-center gap-4">
                <Magnetic>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center gap-2 h-12 px-8 rounded-full bg-white text-black text-[15px] font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.15)] cursor-pointer">
                      <Send className="w-4 h-4" /> Begin the Enquiry
                    </button>
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link href="/collection">
                    <button className="flex items-center gap-2 h-12 px-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white text-[15px] font-medium hover:bg-white/10 transition-colors cursor-pointer">
                      View the Full Collection
                    </button>
                  </Link>
                </Magnetic>
              </div>
            }
          />
        </section>
      </ScrollSlideLeftToRight>

      {/* ═══════════════════════════════════════════════════════
          REVIEWS
      ═══════════════════════════════════════════════════════ */}
      <ScrollSlideRightToLeft>  
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <SectionContent
            eyebrow="Collector Feedback"
            heading="Verified Collector Reviews"
            subtext="See what our collectors say on Google Reviews"
          >
            <ReviewsShowcase reviews={reviews as PublicReview[]} compact />
          </SectionContent>
        </div>
      </section>
      </ScrollSlideRightToLeft>

      {/* ═══════════════════════════════════════════════════════
          PROCESS
      ═══════════════════════════════════════════════════════ */}
      <ScrollSlideBottomToTop>
      <section className="max-w-7xl mx-auto px-4 py-20">
        <SectionContent
          eyebrow="How It Works"
          heading="The Commissioning Process"
          processSteps={process}
        />
      </section>
      </ScrollSlideBottomToTop>
    </div>
  );
}