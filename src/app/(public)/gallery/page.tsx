import Link from 'next/link';
import { Sparkles, MessageCircle, Layers, ShieldCheck, Palette, Truck } from 'lucide-react';
import Button from '@/components/ui/Button';
import GalleryView from '@/components/gallery/GalleryView';
import { getGalleryItems } from '@/lib/gallery-data';
import { WHATSAPP_LINK } from '@/lib/constants';

export const metadata = {
  title: '3D Printed Works Gallery - MiniVersePrints Sri Lanka',
  description: 'Explore our portfolio of handcrafted 3D-printed anime figures, superhero statues, busts, minifigures, custom lamps, and desk accessories in Sri Lanka.',
};

export const revalidate = 60;

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div className="space-y-8 md:space-y-12 pb-16 bg-[#EFE7DC]">
      {/* Hero Header with Background 3D Printing Video (Positioned Up) */}
      <section className="relative overflow-hidden bg-[#1E150E] text-[#FAF7F2] pt-4 pb-12 md:pt-6 md:pb-16 px-4 sm:px-6">
        {/* Background 3D Printing Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover opacity-35 scale-105 filter brightness-90 contrast-110"
          >
            <source src="/videos/3d-printer-timelapse.webm" type="video/webm" />
            <source src="/videos/3d-printer-timelapse.mp4" type="video/mp4" />
          </video>
          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E150E] via-[#2A1D15]/70 to-[#1E150E]/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/60" />
        </div>

        {/* Live Studio Status Indicator */}
        <div className="relative z-10 flex items-center justify-center mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-mono text-[#D6C7B7]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-green-500 -ml-3" />
            <span>STUDIO 3D PRINTING IN ACTION</span>
          </div>
        </div>

        {/* Centered Luxury Exhibition Plaque Card */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="bg-[#FAF6F0]/95 backdrop-blur-xl text-[#1F150E] rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_16px_40px_rgba(0,0,0,0.3)] border border-white/60 text-center space-y-3.5">
            {/* Top Amber Accent Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E3D3] text-[#A34E17] text-xs font-bold uppercase tracking-widest shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              Handmade With Passion &amp; Precision
            </div>

            {/* Main Exhibition Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1F150E] leading-tight">
              3D Printed Works Gallery
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#6E5A4B] leading-relaxed max-w-lg mx-auto">
              A curated showcase of our handcrafted anime statues, superhero figures, busts, miniatures, and custom one-of-a-kind models crafted for collectors across Sri Lanka.
            </p>

            {/* Studio Guarantee Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#D5C5B5] text-[11px] font-bold text-[#6E5A4B]">
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#EFE7DC]/60">
                <Layers className="w-3.5 h-3.5 text-[#A34E17]" />
                <span>8K Precision</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#EFE7DC]/60">
                <Palette className="w-3.5 h-3.5 text-[#A34E17]" />
                <span>Hand Painted</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#EFE7DC]/60">
                <ShieldCheck className="w-3.5 h-3.5 text-[#A34E17]" />
                <span>Custom STL</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#EFE7DC]/60">
                <Truck className="w-3.5 h-3.5 text-[#A34E17]" />
                <span>Island Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 -mt-6 md:-mt-8 relative z-20">
        <GalleryView initialItems={items} />

        {/* Bottom Custom Order Banner */}
        <div className="bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-[#A34E17]">
              Custom Requests Welcome
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1F150E]">
              Have a Custom Figure in Mind?
            </h2>
            <p className="text-[#6E5A4B] text-xs md:text-sm max-w-xl leading-relaxed">
              Can&apos;t find your favourite character or have a unique gift idea? Send us your reference photos or 3D STL files and we&apos;ll print and paint it for you!
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/custom-order">
              <Button size="lg" className="bg-[#A34E17] hover:bg-[#853D10] text-white font-bold shadow-md">
                <Sparkles className="w-4 h-4 mr-2 text-[#F59E0B]" /> Request Custom Order
              </Button>
            </Link>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold shadow-md">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Enquiry
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
