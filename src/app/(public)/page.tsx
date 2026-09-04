import { createClient, createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Video, Send } from "lucide-react";
import ProductCarousel from "@/components/product/ProductCarousel";
import ReviewsShowcase from "@/components/reviews/ReviewsShowcase";
import { WHATSAPP_LINK } from "@/lib/constants";
import { Product, Category } from "@/types";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { hasSupabasePreview } from "@/lib/product-preview";
import { demoCategories, demoProducts } from "@/lib/demo-store";
import {
  demoPublicReviews,
  getPublicReviews,
  PublicReview,
} from "@/lib/reviews-data";
import ScrollFX from "@/components/motion/ScrollFx";
import Magnetic from "@/components/motion/Magnetic";
import Cursor from "@/components/motion/Cursor";
import HeroSequence from "@/components/HeroSequence";
import SectionContent from "@/components/motion/SectionContent";
import ScrollSlideX from "@/components/motion/ScrollSlideX";
import PerspectiveCarousel from "@/components/product/PerspectiveCarousel";
import ScrollFlipSection from "@/components/motion/ScrollFlipSection";
import ScrollSlideLeftToRight from "@/components/motion/ScrollSlideLeftToRight";
import ScrollSlideRightToLeft from "@/components/motion/ScrollSlideRightToLeft";
import ScrollSlideBottomToTop from "@/components/motion/ScrollSlideBottomToTop";
import CommissionsCTA from "@/components/cta/CommissionsCTA";
import HeroVedio from "@/components/HeroVedio";

export const revalidate = 60;

function getDemoHomeData() {
  return {
    featured: [],
    newArrivals: "",
    bestSellers: "",
    categories: "",
    banners: [],
    reviews: "",
  };
}

async function getHomeData() {
  if (!hasSupabaseConfig()) {
    return getDemoHomeData();
  }

  // Use admin client for public home queries to avoid RLS blocking access to product images set by admins
  const supabase = createAdminClient();

  const [featured, newArrivals, bestSellers, categories, banners, reviews] =
    await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("products")
        .select("*")
        .eq("is_new_arrival", true)
        .eq("is_active", true)
        .limit(24),
      supabase
        .from("products")
        .select("*")
        .eq("is_best_seller", true)
        .eq("is_active", true)
        .limit(24),
      supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .limit(12),
      supabase
        .from("homepage_banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .limit(5),
      getPublicReviews(3),
    ]);

  // Development-time debug: log featured products and why they may be filtered
  if (process.env.NODE_ENV !== "production") {
    try {
      const items = (featured.data || []).map((p: any) => {
        const model =
          p.model_url ||
          (p.attributes || []).find((a: any) => a?.name === "model_url")
            ?.value ||
          null;
        const images = p.image_url?.length ? p.image_url : p.images || [];
        const main =
          images.find((i: any) => i.is_main) ||
          images[0] ||
          (p.image_url ? { url: p.image_url } : null);
        const imageUrl = main ? main.url || main : null;
        return {
          id: p.id,
          slug: p.slug,
          modelUrl: p.model_url,
          imageUrl: p.image_url,
          hasSupabasePreview: hasSupabasePreview(p),
        };
      });

      console.log(
        "DEBUG: featured products count =",
        (featured.data || []).length,
      );
      console.log(
        "DEBUG featured products preview check:",
        JSON.stringify(items, null, 2),
      );
    } catch (e) {
      console.log("DEBUG: failed to compute featured preview debug", e);
    }
  }

  if (
    featured.error ||
    newArrivals.error ||
    bestSellers.error ||
    categories.error
  ) {
    return {
      ...getDemoHomeData(),
      reviews,
    };
  }

  // Server-side: prefer featured items that have Supabase-hosted previews.
  const rawFeatured = (featured.data || []) as Product[];
  const supaFeatured = rawFeatured.filter((p) => hasSupabasePreview(p as any));

  let featuredProducts: Product[] = [];
  if (supaFeatured.length > 0) {
    featuredProducts = supaFeatured;
  } else if (rawFeatured.length === 0) {
    // If there were no featured rows, fall back to recent active products and prefer Supabase previews
    const { data: recent } = await supabase
      .from("products")
      .select("*, product_images(*), attributes(*), product_attributes(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(50);
    const pool = (recent || []) as Product[];
    const filtered = pool.filter((p) => hasSupabasePreview(p as any));
    featuredProducts = filtered.length > 0 ? filtered : pool;
  } else {
    // There were featured rows but none had Supabase previews — try recent Supabase items, else fall back to raw featured so gallery isn't empty.
    const { data: recent } = await supabase
      .from("products")
      .select("*, product_images(*), attributes(*), product_attributes(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(50);
    const pool = (recent || []) as Product[];
    const filtered = pool.filter((p) => hasSupabasePreview(p as any));
    featuredProducts = filtered.length > 0 ? filtered : rawFeatured;
  }

  return {
    featured: featuredProducts,
    newArrivals: (newArrivals.data || []) as Product[],
    bestSellers: (bestSellers.data || []) as Product[],
    categories: (categories.data || []) as Category[],
    banners: banners.data || [],
    reviews,
  };
}

export default async function HomePage() {
  const { featured, newArrivals, bestSellers, categories, banners, reviews } =
    await getHomeData();

  const craftPoints = [
    {
      iconName: "Layers",
      title: "Micron-Level Layer Resolution",
      desc: "Ultra-crisp detail retention even on intricate anime facial features.",
    },
    {
      iconName: "Sparkles",
      title: "Hand-Painted Finishing",
      desc: "Custom shade palettes, airbrushing, and protective matte or glossy coats.",
    },
  ];

  const process = [
    {
      iconName: "Compass",
      title: "Discover",
      desc: "Browse the collection, or share a reference for a piece that doesn’t exist yet",
    },
    {
      iconName: "MessageCircle",
      title: "Consult",
      desc: "We talk through scale, finish, and detail together before anything is made",
    },
    {
      iconName: "Palette",
      title: "Create",
      desc: "Your piece is sculpted, cast, and hand-painted in the atelier",
    },
    {
      iconName: "Shield",
      title: "Deliver",
      desc: "Each piece is inspected under studio light before it leaves us",
    },
  ];

  return (
    <div className="relative bg-black overflow-x-clip">
      {/* Scroll FX progress bar + cursor */}
      <ScrollFX />
      <Cursor />

      {/* ═══════════════════════════════════════════════════════
          HERO — scroll-scrubbing car frame sequence
      ═══════════════════════════════════════════════════════ */}
      <HeroVedio />

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
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      >
                        <source src="/process-preview.mp4" type="video/mp4" />
                      </video>
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium border border-white/10 flex items-center gap-2 text-zinc-300">
                        <Video className="w-4 h-4 text-zinc-400" /> Inside the
                        Atelier
                      </div>
                    </div>
                  }
                  craftPoints={craftPoints}
                />
              
            </div>
          </section>
        }
      />

      {/* CTA  */}
      <ScrollSlideLeftToRight>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <CommissionsCTA />
          </div>
        </section>
      </ScrollSlideLeftToRight>

      {/* ═══════════════════════════════════════════════════════
          REVIEWS
      ═══════════════════════════════════════════════════════ */}
      <ScrollSlideBottomToTop>
        <section className="py-16 flex justify-center">
          <div className="max-w-7xl">
            <SectionContent
              eyebrow="Collector Feedback"
              heading="Verified Collector Reviews"
              subtext="See what our collectors say on Google Reviews"
            >
              <ReviewsShowcase reviews={reviews as PublicReview[]} compact />
            </SectionContent>
          </div>
        </section>
      </ScrollSlideBottomToTop>

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
