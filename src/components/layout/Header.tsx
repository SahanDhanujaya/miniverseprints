'use client';

import Link from 'next/link';
import { Search, ShoppingCart, Heart, User, Menu, X, Package } from 'lucide-react';
import { useState } from 'react';
import { WHATSAPP_LINK } from '@/lib/constants';
import Button from '@/components/ui/Button';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/custom-order', label: 'Custom Order' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Package className="w-7 h-7 text-accent group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold">
              Mini<span className="text-accent">Verse</span>Prints
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/search" className="p-2 rounded-lg hover:bg-background-hover text-foreground-muted hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/account/wishlist" className="p-2 rounded-lg hover:bg-background-hover text-foreground-muted hover:text-foreground transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="p-2 rounded-lg hover:bg-background-hover text-foreground-muted hover:text-foreground transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link href="/account" className="p-2 rounded-lg hover:bg-background-hover text-foreground-muted hover:text-foreground transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">WhatsApp</Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/cart" className="p-2 text-foreground-muted">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-background-hover text-foreground-muted"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background-secondary animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex gap-2">
              <Link href="/search" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 rounded-xl bg-background-hover text-foreground-muted">
                <Search className="w-5 h-5 mx-auto" />
              </Link>
              <Link href="/account/wishlist" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 rounded-xl bg-background-hover text-foreground-muted">
                <Heart className="w-5 h-5 mx-auto" />
              </Link>
              <Link href="/account" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 rounded-xl bg-background-hover text-foreground-muted">
                <User className="w-5 h-5 mx-auto" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
