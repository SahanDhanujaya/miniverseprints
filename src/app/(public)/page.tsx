import Link from 'next/link';
import Image from 'next/image';
import {
  MessageCircle,
  Truck,
  Sparkles,
  ArrowRight,
  Package,
  Palette,
  ShieldCheck,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import ReviewsShowcase from '@/components/reviews/ReviewsShowcase';
import { WHATSAPP_LINK, WHATSAPP_NUMBER } from '@/lib/constants';
import { getGalleryItems } from '@/lib/gallery-data';
import { getPublicReviews, PublicReview } from '@/lib/reviews-data';
import { GALLERY_CATEGORIES } from '@/lib/demo-gallery';
import GalleryCard from '@/components/gallery/GalleryCard';

export const revalidate = 60;

export default async function HomePage() {
  const [featuredWorks, reviews] = await Promise.all([
    getGalleryItems({ featuredOnly: true, limit: 8 }),
    getPublicReviews(3),
  ]);

  return (
    <div className="space-y-16 md:space-y-24 pb-16 bg-[#EFE7DC]">
      {/* Hero Section with Ambient 3D Printing Video Background */}
      <section className="relative overflow-hidden bg-[#1E150E] text-[#FAF7F2] pt-16 pb-24 md:py-28 px-4 sm:px-6">
        {/* Background 3D Printing Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-25 scale-105 filter brightness-75 contrast-125"
          >
            <source src="/videos/3d-printer-timelapse.webm" type="video/webm" />
            <source src="/videos/3d-printer-timelapse.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E150E] via-[#2A1D15]/85 to-[#1E150E]/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#A34E17]/50 bg-[#A34E17]/25 backdrop-blur-md text-[#F5E3D3] text-xs font-bold uppercase tracking-widest shadow-2xs">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" /> Sri Lanka&apos;s 3D Printing &amp; Figure Studio
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white">
                Custom <span className="text-[#F59E0B]">3D-Printed Figures</span>, Busts &amp; Collectibles
              </h1>

              <p className="text-base md:text-lg text-[#D6C7B7] max-w-xl leading-relaxed">
                Handcrafted anime statues, superhero figures, custom portrait busts, and personalized gaming desk setups. Precision 3D printed and hand-painted for collectors.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/gallery">
                  <Button size="lg" className="bg-[#A34E17] hover:bg-[#853D10] text-white font-bold shadow-lg">
                    <ImageIcon className="w-5 h-5 mr-2" /> Explore Our Gallery <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/custom-order">
                  <Button size="lg" variant="outline" className="font-bold border-[#8C7A6B] text-white hover:bg-white/10 backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 mr-2 text-[#F59E0B]" /> Custom Order Form
                  </Button>
                </Link>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold shadow-lg">
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp ({WHATSAPP_NUMBER})
                  </Button>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#38281E] text-xs text-[#C2B4A3]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>8K Precision Resin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                  <span>Acrylic Hand-Painting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                  <span>Island-wide Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Feature */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-square max-w-md mx-auto rounded-3xl overflow-hidden border border-[#523F32] bg-[#2C1F16]/90 backdrop-blur-md shadow-2xl p-4">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#221811]">
                  <Image
                    src={featuredWorks[0]?.image_url || '/images/products/allmight.png'}
                    alt="Featured 3D Printed Figure"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain p-4"
                    priority
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-4 rounded-2xl bg-[#1F150E]/90 backdrop-blur-md border border-[#38281E] shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">Featured Craft</span>
                        <h3 className="font-serif font-bold text-sm text-white">{featuredWorks[0]?.title || 'All Might Dynamic Figure'}</h3>
                      </div>
                      <Link href="/gallery">
                        <Button size="sm" variant="outline" className="text-xs border-[#8C7A6B] text-white hover:bg-white/10">
                          View Gallery →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5E3D3] text-[#A34E17] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Handcrafted Showcase
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#1F150E]">
              Featured 3D Prints &amp; Figures
            </h2>
            <p className="text-[#6E5A4B] text-sm mt-1">
              A glimpse of finished collectibles, desk accessories, and custom models crafted for our customers.
            </p>
          </div>
          <Link href="/gallery" className="inline-flex items-center gap-1.5 text-[#A34E17] font-bold hover:underline text-sm">
            <span>View All Works in Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWorks.slice(0, 8).map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="bg-[#E4D7C7] py-16 border-y border-[#D5C5B5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F150E]">What We Make &amp; Print</h2>
            <p className="text-[#6E5A4B] text-sm">
              Explore our various 3D printing specialties or submit your own custom idea.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {GALLERY_CATEGORIES.filter((c) => c !== 'All').map((category) => (
              <Link
                key={category}
                href="/gallery"
                className="group bg-[#FAF6F0] rounded-2xl border border-[#D5C5B5] p-5 text-center hover:border-[#A34E17] hover:shadow-md transition-all flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F5E3D3] flex items-center justify-center text-[#A34E17] group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6" />
                </div>
                <span className="text-xs md:text-sm font-bold text-[#1F150E] group-hover:text-[#A34E17] transition-colors text-center">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How Custom 3D Printing Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5E3D3] text-[#A34E17] text-xs font-bold uppercase tracking-wider">
            ✨ Seamless 4-Step Process
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F150E]">How Custom Orders Work</h2>
          <p className="text-[#6E5A4B] text-sm">
            Ordering a custom 3D printed model or figure is straightforward and transparent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Submit Your Request',
              desc: 'Fill out our custom order form with your character name, scale, and references.',
              icon: Sparkles,
            },
            {
              step: '2',
              title: 'Get WhatsApp Quote',
              desc: 'We review the 3D files and message you directly with exact timeline and pricing.',
              icon: MessageCircle,
            },
            {
              step: '3',
              title: '3D Print & Paint',
              desc: 'Our artisans 3D print in 8K resin or PLA, then apply precision acrylic paint.',
              icon: Palette,
            },
            {
              step: '4',
              title: 'Safe Island-wide Delivery',
              desc: 'Securely packaged in protective foam and delivered safely to your doorstep.',
              icon: Truck,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] p-6 space-y-4 shadow-xs hover:border-[#A34E17] transition-all hover:shadow-md relative"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#F5E3D3] flex items-center justify-center text-[#A34E17]">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-[#D5C5B5] font-mono">
                  0{item.step}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1F150E]">{item.title}</h3>
              <p className="text-xs text-[#6E5A4B] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/custom-order">
            <Button size="lg" className="bg-[#A34E17] hover:bg-[#853D10] text-white font-bold">
              <Sparkles className="w-5 h-5 mr-2 text-[#F59E0B]" /> Start Your Custom Order Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Customer Reviews Showcase */}
      <ReviewsShowcase reviews={reviews as PublicReview[]} compact />

      {/* Big Direct WhatsApp CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <div className="bg-[#FAF6F0] border-2 border-green-500/30 rounded-3xl p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider">
              <MessageCircle className="w-3.5 h-3.5 text-green-600" /> Instant WhatsApp Assistance
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#1F150E]">
              Have an Idea or Need a Fast Quote?
            </h2>
            <p className="text-[#6E5A4B] text-sm md:text-base max-w-xl leading-relaxed">
              Message us directly on WhatsApp at <strong className="text-[#1F150E] font-bold">{WHATSAPP_NUMBER}</strong> with your character name or reference photos. We reply promptly!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold shadow-lg shadow-green-900/20 py-4 px-8">
                <MessageCircle className="w-5 h-5 mr-2" /> Chat on WhatsApp ({WHATSAPP_NUMBER})
              </Button>
            </a>
            <Link href="/custom-order" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full font-bold border-[#D5C5B5] text-[#1F150E] py-4 px-6">
                Custom Order Form
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
