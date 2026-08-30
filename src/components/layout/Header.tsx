'use client';

import Link from 'next/link';
import { Search, Menu, X, Globe, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { WHATSAPP_LINK } from '@/lib/constants';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Mapped to Gallery focus instead of Store
  const navLinks = [
    { href: '#gallery', label: 'Gallery' },
    { href: '/custom-order', label: 'Custom Order' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-black/60 border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.6)] transition-all" style={{ WebkitBackdropFilter: 'blur(24px)' }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center h-[72px]">
          
          {/* Left Section: Logo & Nav */}
          <div className="flex items-center gap-12 flex-1">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-[22px] tracking-tight text-white font-bold flex items-center">
                MiniVerse<span className="text-zinc-400 font-semibold ml-[1px]">Prints</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[14px] font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section: Actions */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Commission CTA button */}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <button className="flex items-center gap-2 h-9 px-5 bg-zinc-100 hover:bg-white text-black font-semibold rounded-full text-[13px] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer">
                <MessageCircle className="w-[15px] h-[15px]" />
                Enquire
              </button>
            </a>
            
            {/* Sleek Line Icons */}
            <div className="flex items-center gap-5 border-l border-white/10 pl-5">
              <Link href="/search" className="text-zinc-400 hover:text-white transition-colors">
                <Search className="w-5 h-5 flex-shrink-0" />
              </Link>
              {/* WhatsApp Link representing Global/Contact */}
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5 flex-shrink-0" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden ml-auto">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-zinc-300 p-1"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#0a0a0a] animate-fade-in absolute w-full left-0">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-[15px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-2 px-2">
              <Link href="/search" onClick={() => setMobileOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-lg bg-zinc-900/50 text-zinc-400 hover:text-white">
                <Search className="w-5 h-5 mb-1" />
                <span className="text-[11px]">Search</span>
              </Link>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-3 rounded-lg bg-zinc-900/50 text-zinc-400 hover:text-white">
                <MessageCircle className="w-5 h-5 mb-1" />
                <span className="text-[11px]">Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
