import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Truck, Shield, Clock, ArrowRight, Package, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProductGrid from '@/components/product/ProductGrid';
import ReviewsShowcase from '@/components/reviews/ReviewsShowcase';
import { WHATSAPP_LINK, CURRENCY_SYMBOL } from '@/lib/constants';
import { Product, Category } from '@/types';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { demoCategories, demoProducts } from '@/lib/demo-store';
import { demoPublicReviews, getPublicReviews, PublicReview } from '@/lib/reviews-data';

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

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-background-secondary overflow-hidden hero-ambient">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-2xl reveal-on-scroll">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Premium <span className="text-accent">3D-Printed</span> Figures & Collectibles
            </h1>
            <p className="text-lg text-foreground-muted mb-8">
              Handcrafted anime, superhero, and custom figures from Sri Lanka. Every piece is made with passion and precision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <Button size="lg" className="magnetic-button">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="magnetic-button">
                  <MessageCircle className="w-5 h-5" /> Order via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-accent/5 to-transparent" />
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="reveal-on-scroll max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/shop" className="text-accent hover:underline text-sm font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="reveal-on-scroll bg-background-secondary py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop/category/${cat.slug}`}
                  className="category-tile group bg-background-card rounded-2xl border border-border p-6 text-center transition-all"
                >
                  <Package className="w-8 h-8 mx-auto mb-3 text-foreground-muted group-hover:text-accent transition-colors" />
                  <span className="text-sm font-medium group-hover:text-accent transition-colors">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="reveal-on-scroll max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link href="/shop" className="text-accent hover:underline text-sm font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} columns={3} />
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="reveal-on-scroll bg-background-secondary py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Best Sellers</h2>
              <Link href="/shop" className="text-accent hover:underline text-sm font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid products={bestSellers} columns={3} />
          </div>
        </section>
      )}

      <ReviewsShowcase reviews={reviews as PublicReview[]} compact />

      {/* How Ordering Works */}
      <section className="reveal-on-scroll max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-12">How Ordering Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Package, title: 'Browse & Choose', desc: 'Explore our collection and pick your favourite figures' },
            { icon: MessageCircle, title: 'Order & Pay', desc: 'Checkout securely or order via WhatsApp' },
            { icon: Clock, title: 'We Print & Paint', desc: 'Your figure is crafted with care and precision' },
            { icon: Truck, title: 'Delivered to You', desc: 'Fast delivery across Sri Lanka' },
          ].map((step, i) => (
            <div key={i} className="step-card text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300">
                <step.icon className="w-8 h-8 text-accent" />
              </div>
              <div className="text-sm text-accent font-bold mb-1">Step {i + 1}</div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-foreground-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Info Banner */}
      <section className="reveal-on-scroll bg-accent/5 border-y border-accent/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-accent" />
              <div>
                <h3 className="font-bold">Island-wide Delivery</h3>
                <p className="text-sm text-foreground-muted">Free delivery on orders over {CURRENCY_SYMBOL} 5,000</p>
              </div>
            </div>
            <Link href="/delivery">
              <Button variant="outline">Delivery Details</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="reveal-on-scroll max-w-7xl mx-auto px-4 py-16">
        <div className="bg-background-card rounded-2xl border border-border p-8 md:p-12 text-center hover-lift">
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="text-foreground-muted mb-6">Get notified about new arrivals and exclusive offers.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* Social Media Placeholders */}
      <section className="reveal-on-scroll bg-background-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Follow Us</h2>
          <p className="text-foreground-muted mb-6">Stay connected on social media for behind-the-scenes content</p>
          <div className="flex justify-center gap-4">
            <a href="https://instagram.com/miniverseprints" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-background-card border border-border hover:border-accent/50 transition-colors text-sm font-medium">
              Instagram
            </a>
            <a href="https://facebook.com/miniverseprints" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-background-card border border-border hover:border-accent/50 transition-colors text-sm font-medium">
              Facebook
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
