import Link from 'next/link';
import { Package, Camera, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { WHATSAPP_LINK } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Package className="w-6 h-6 text-accent" />
              <span className="text-lg font-bold">
                Mini<span className="text-accent">Verse</span>Prints
              </span>
            </Link>
            <p className="text-sm text-foreground-muted mb-4">
              Premium 3D-printed figures, busts, miniatures, and collectibles from Sri Lanka.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/miniverseprints" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-background-hover text-foreground-muted hover:text-accent transition-colors">
                <Camera className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/miniverseprints" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-background-hover text-foreground-muted hover:text-accent transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-background-hover text-foreground-muted hover:text-accent transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/shop', label: 'Shop All' },
                { href: '/shop/category/action-figures', label: 'Action Figures' },
                { href: '/shop/category/minifigures', label: 'Minifigures' },
                { href: '/shop/category/valentine-gifts', label: 'Valentine Gifts' },
                { href: '/custom-order', label: 'Custom Orders' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/shop/category/action-figures', label: 'Action Figures' },
                { href: '/shop/category/minifigures', label: 'Minifigures' },
                { href: '/shop/category/bust-figures', label: 'Bust Figures' },
                { href: '/shop/category/valentine-gifts', label: 'Valentine Gifts' },
                { href: '/shop/category/hotwheel-racks', label: 'Hotwheel Racks' },
                { href: '/shop/category/keychains', label: 'Keychains' },
                { href: '/shop/category/controller-holders', label: 'Controller Holders' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Info */}
          <div>
            <h3 className="font-semibold mb-4">Help & Info</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/contact', label: 'Contact Us' },
                { href: '/delivery', label: 'Delivery Information' },
                { href: '/returns', label: 'Returns & Refunds' },
                { href: '/faq', label: 'FAQ' },
                { href: '/track-order', label: 'Track Order' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms & Conditions' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-foreground-muted hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-foreground-muted">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> hello@miniverseprints.lk
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> +94 78 252 5156
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Sri Lanka
            </span>
          </div>
          <p className="text-sm text-foreground-muted">
            &copy; {new Date().getFullYear()} MiniVersePrints. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
