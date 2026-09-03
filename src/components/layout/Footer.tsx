'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Camera, Globe, Phone, Mail, MapPin, ChevronDown } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/constants';

interface AccordionSectionProps {
  title: string;
  links: { href: string; label: string }[];
}

function AccordionSection({ title, links }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/60 md:border-none py-3 md:py-0">
      {/* Mobile Toggle Button / Desktop Static Heading */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-semibold text-foreground md:cursor-default md:mb-4"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-foreground-muted transition-transform duration-300 md:hidden ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Accordion Links Wrapper */}
      <div
        className={`grid transition-all duration-300 ease-in-out md:grid md:opacity-100 ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 md:grid-rows-none'
        }`}
      >
        <ul className="overflow-hidden space-y-2.5">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-foreground-muted hover:text-foreground transition-colors block py-0.5"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Footer() {
  const quickLinks = [
    { href: '/shop', label: 'Shop All' },
    { href: '/shop/category/action-figures', label: 'Action Figures' },
    { href: '/shop/category/minifigures', label: 'Minifigures' },
    { href: '/shop/category/valentine-gifts', label: 'Valentine Gifts' },
    { href: '/custom-order', label: 'Custom Orders' },
  ];

  const categoryLinks = [
    { href: '/shop/category/action-figures', label: 'Action Figures' },
    { href: '/shop/category/minifigures', label: 'Minifigures' },
    { href: '/shop/category/bust-figures', label: 'Bust Figures' },
    { href: '/shop/category/valentine-gifts', label: 'Valentine Gifts' },
    { href: '/shop/category/hotwheel-racks', label: 'Hotwheel Racks' },
    { href: '/shop/category/keychains', label: 'Keychains' },
    { href: '/shop/category/controller-holders', label: 'Controller Holders' },
  ];

  const helpLinks = [
    { href: '/contact', label: 'Contact Us' },
    { href: '/delivery', label: 'Delivery Information' },
    { href: '/returns', label: 'Returns & Refunds' },
    { href: '/faq', label: 'FAQ' },
    { href: '/track-order', label: 'Track Order' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
  ];

  return (
    <footer className="bg-background-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Brand Info */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Package className="w-6 h-6 text-accent" />
              <span className="text-lg font-bold tracking-tight">
                Mini<span className="text-accent">Verse</span>Prints
              </span>
            </Link>
            <p className="text-sm text-foreground-muted mb-6 leading-relaxed max-w-sm">
              Premium 3D-printed figures, busts, miniatures, and collectibles crafted with care in Sri Lanka.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com/miniverseprints"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-xl bg-background-hover text-foreground-muted hover:text-accent transition-colors"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/miniverseprints"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-xl bg-background-hover text-foreground-muted hover:text-accent transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="p-2.5 rounded-xl bg-background-hover text-foreground-muted hover:text-accent transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <AccordionSection title="Quick Links" links={quickLinks} />

          {/* Categories */}
          <AccordionSection title="Categories" links={categoryLinks} />

          {/* Help & Info */}
          <AccordionSection title="Help & Info" links={helpLinks} />
        </div>

        {/* Contact Info & Copyright Bar */}
        <div className="mt-10 md:mt-12 pt-8 border-t border-border/80 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6 text-sm text-foreground-muted flex-wrap">
            <a
              href="mailto:hello@miniverseprints.lk"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Mail className="w-4 h-4 text-accent" /> hello@miniverseprints.lk
            </a>
            <a
              href="tel:+94782525156"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Phone className="w-4 h-4 text-accent" /> +94 78 252 5156
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" /> Sri Lanka
            </span>
          </div>

          <p className="text-xs sm:text-sm text-foreground-muted">
            &copy; {new Date().getFullYear()} MiniVersePrints. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}