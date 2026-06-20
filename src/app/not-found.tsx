import Link from 'next/link';
import { Package, Home, Search } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6">
          <Package className="w-20 h-20 text-accent mx-auto" />
        </div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-foreground-muted mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for seems to have wandered off. Maybe it&apos;s being 3D printed somewhere.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg"><Home className="w-5 h-5 mr-2" /> Go Home</Button>
          </Link>
          <Link href="/shop">
            <Button size="lg" variant="outline"><Search className="w-5 h-5 mr-2" /> Browse Shop</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
