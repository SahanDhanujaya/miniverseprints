import Breadcrumb from '@/components/ui/Breadcrumb';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { WHATSAPP_LINK, WHATSAPP_NUMBER } from '@/lib/constants';

export const metadata = {
  title: 'Contact Us - MiniVersePrints Sri Lanka',
  description: 'Get in touch with MiniVersePrints for custom 3D printing orders, figure inquiries, and quotes in Sri Lanka.',
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10 bg-[#EFE7DC]">
      <Breadcrumb items={[{ label: 'Contact Us' }]} />

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5E3D3] text-[#A34E17] text-xs font-bold uppercase tracking-wider">
          💬 Get In Touch
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#1F150E]">
          We&apos;d Love To Hear From You
        </h1>
        <p className="text-[#6E5A4B] text-sm md:text-base leading-relaxed">
          Whether you have questions about custom 3D models, paint finishes, materials, or order delivery, reach out to us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] p-6 md:p-8 space-y-6 shadow-xs">
            <h2 className="font-serif font-bold text-xl text-[#1F150E] border-b border-[#D5C5B5] pb-3">Contact Information</h2>

            <div className="space-y-4">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-2xl bg-green-50 border border-green-200 hover:border-green-400 transition-colors group"
              >
                <div className="p-2.5 rounded-xl bg-[#16A34A] text-white flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-green-700 uppercase tracking-wider">WhatsApp (Fastest Response)</div>
                  <div className="font-bold text-base text-[#1F150E] mt-0.5 group-hover:text-green-700 transition-colors">
                    {WHATSAPP_NUMBER}
                  </div>
                  <p className="text-xs text-[#6E5A4B] mt-1">Chat directly for quotes and inquiries</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#EFE7DC] border border-[#D5C5B5]">
                <div className="p-2.5 rounded-xl bg-[#F5E3D3] text-[#A34E17] flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#6E5A4B] uppercase tracking-wider">Email</div>
                  <div className="font-bold text-base text-[#1F150E] mt-0.5">hello@miniverseprints.lk</div>
                  <p className="text-xs text-[#6E5A4B] mt-1">For general questions and bulk requests</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#EFE7DC] border border-[#D5C5B5]">
                <div className="p-2.5 rounded-xl bg-[#F5E3D3] text-[#A34E17] flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#6E5A4B] uppercase tracking-wider">Location & Delivery</div>
                  <div className="font-bold text-base text-[#1F150E] mt-0.5">Sri Lanka</div>
                  <p className="text-xs text-[#6E5A4B] mt-1">Island-wide door-to-door courier delivery</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold py-3.5 rounded-xl shadow-md">
                  <MessageCircle className="w-5 h-5 mr-2" /> Message Us on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#FAF6F0] rounded-3xl border border-[#D5C5B5] p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#1F150E]">Send Us a Direct Message</h2>
            <p className="text-xs text-[#6E5A4B] mt-1">
              Prefer leaving a note here? Drop your message and we&apos;ll get back to you promptly.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="name" name="name" label="Your Name" placeholder="e.g., Sahan Dhanujaya" required />
              <Input id="whatsapp" name="whatsapp" label="WhatsApp Number" placeholder="e.g., 078 123 4567" required />
            </div>
            <Input id="email" name="email" type="email" label="Email Address (Optional)" placeholder="yourname@example.com" />
            <Input id="subject" name="subject" label="Subject" placeholder="Custom figure inquiry, delivery question, etc." required />
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-[#1F150E] mb-1.5">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-[#EFE7DC] hover:bg-white focus:bg-white border border-[#D5C5B5] text-[#1F150E] text-sm focus:outline-none focus:ring-2 focus:ring-[#A34E17]/30 focus:border-[#A34E17]"
                placeholder="How can we help you?"
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full bg-[#A34E17] hover:bg-[#853D10] text-white font-bold">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
