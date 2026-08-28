import Breadcrumb from '@/components/ui/Breadcrumb';
import CustomOrderClient from '@/components/custom-order/CustomOrderClient';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export const metadata = {
  title: 'Custom 3D Print Order - MiniVersePrints Sri Lanka',
  description: 'Order custom 3D-printed anime figures, busts, miniatures, cosplay props, lithophane lamps, and personalized gifts in Sri Lanka.',
};

export default function CustomOrderPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10 bg-[#EFE7DC]">
      <Breadcrumb items={[{ label: 'Custom Order' }]} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D5C5B5] bg-[#FAF6F0] text-[#A34E17] text-xs font-bold uppercase tracking-widest shadow-2xs">
          ✨ Bespoke 3D Printing Service
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#1F150E]">
          Bring Your Dream Figure To Life
        </h1>
        <p className="text-[#6E5A4B] text-sm md:text-base leading-relaxed">
          From custom anime figures and gaming statues to personalized lithophane lamps and gifts.
          Fill out the form below to get an instant quote and preview sent directly to our WhatsApp ({WHATSAPP_NUMBER}).
        </p>
      </div>

      <CustomOrderClient />
    </div>
  );
}
