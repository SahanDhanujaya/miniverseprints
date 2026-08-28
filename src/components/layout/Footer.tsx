import Link from 'next/link';
import Image from 'next/image';
import { Camera, Globe, Mail, Phone, MapPin, Sparkles, MessageCircle } from 'lucide-react';
import { WHATSAPP_LINK, WHATSAPP_NUMBER } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#221811] text-[#FAF7F2] border-t border-[#38281E] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white p-0.5 shadow-sm border border-white/30 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="MiniVersePrints Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-lg font-bold text-white">
                Mini<span className="text-[#F59E0B]">Verse</span>Prints
              </span>
            </Link>
            <p className="text-xs text-[#C2B4A3] leading-relaxed">
              Sri Lanka&apos;s premier custom 3D printing studio specializing in handcrafted anime figures, busts, miniatures, personalized gifts, and gaming desk setups.
            </p>
            <div className="flex gap-2.5">
              <a
                href="https://instagram.com/miniverseprints"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#2D2017] border border-[#3E2E22] text-[#D6C7B7] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/miniverseprints"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#2D2017] border border-[#3E2E22] text-[#D6C7B7] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-green-950/60 border border-green-700/40 text-green-400 hover:bg-green-600 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-white mb-4">Explore</h3>
            <ul className="space-y-2.5 text-xs text-[#C2B4A3]">
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Work Gallery Portfolio
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#F59E0B]" /> Custom 3D Order Request
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About MiniVersePrints
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-white mb-4">Gallery Categories</h3>
            <ul className="space-y-2.5 text-xs text-[#C2B4A3]">
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Action Figures & Statues
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Anime Bust Figures
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Chibi & Funko Minifigures
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Gaming Controller & Headset Stands
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Personalized Lithophane Lamps & Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-white mb-4">Contact & Support</h3>
            <ul className="space-y-2.5 text-xs text-[#C2B4A3]">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-white transition-colors">
                  Island-wide Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline flex items-center gap-1.5 font-medium"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp: {WHATSAPP_NUMBER}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-[#38281E] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A89887]">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#F59E0B]" /> {WHATSAPP_NUMBER}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#F59E0B]" /> hello@miniverseprints.lk
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" /> Island-wide Delivery across Sri Lanka
            </span>
          </div>
          <p>
            &copy; {new Date().getFullYear()} MiniVersePrints Sri Lanka. Handcrafted with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
