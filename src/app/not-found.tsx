import Link from 'next/link';
import { Package, Home, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-6">
          <Package className="w-10 h-10" />
        </div>
        <h1 className="text-6xl font-black text-accent tracking-tight">404</h1>
        <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
        <p className="text-foreground-muted text-sm leading-relaxed">
          Oops! The page you&apos;re looking for seems to have wandered off. Maybe it&apos;s being 3D printed right now.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" /> Go Home
            </Button>
          </Link>
          <Link href="/gallery">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Sparkles className="w-4 h-4 mr-2 text-accent" /> Browse Gallery
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
