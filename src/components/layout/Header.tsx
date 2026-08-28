'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Sparkles, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { WHATSAPP_LINK } from '@/lib/constants';
import Button from '@/components/ui/Button';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/gallery', label: 'Gallery' },
    { href: '/custom-order', label: 'Custom Order' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#221811] text-[#FAF7F2] border-b border-[#38281E] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-md group-hover:scale-105 transition-transform border border-white/30 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="MiniVersePrints Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-white">
              Mini<span className="text-[#F59E0B]">Verse</span>Prints
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-widest font-bold text-[#D6C7B7] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl text-[#D6C7B7] hover:text-white hover:bg-white/10 transition-colors"
              title="Admin Portal"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link href="/custom-order">
              <Button size="sm" className="bg-[#A34E17] hover:bg-[#853D10] text-white font-bold border-0 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#F59E0B]" /> Custom Order
              </Button>
            </Link>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-[#16A34A] hover:bg-[#15803D] text-white font-bold border-0 shadow-sm">
                <MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="p-2 text-green-400">
              <MessageCircle className="w-6 h-6" />
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-[#D6C7B7] hover:text-white hover:bg-white/10"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#38281E] bg-[#2C1F16] animate-fade-in shadow-xl text-white">
          <div className="px-4 py-5 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold text-[#D6C7B7] hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-[#38281E] space-y-2.5">
              <Link
                href="/custom-order"
                onClick={() => setMobileOpen(false)}
                className="block"
              >
                <Button size="lg" className="w-full bg-[#A34E17] hover:bg-[#853D10] text-white font-bold">
                  <Sparkles className="w-4 h-4 mr-1.5 text-[#F59E0B]" /> Request Custom Order
                </Button>
              </Link>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="block"
              >
                <Button size="lg" className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold">
                  <MessageCircle className="w-4 h-4 mr-1.5" /> Order on WhatsApp
                </Button>
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-2 text-xs text-[#A89887] hover:text-white"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
