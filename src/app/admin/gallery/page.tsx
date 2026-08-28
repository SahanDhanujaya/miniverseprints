import Link from 'next/link';
import Image from 'next/image';
import { Plus, Sparkles, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import GalleryItemActions from './GalleryItemActions';
import { getAllGalleryItemsAdmin } from '@/lib/gallery-data';

export const metadata = {
  title: 'Gallery Manager - Admin Dashboard',
};

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const items = await getAllGalleryItemsAdmin();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gallery Portfolio Manager</h1>
          <p className="text-sm text-foreground-muted">
            Add, update, and manage the 3D-printed figures displayed in your public portfolio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/gallery" target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-1.5" /> View Public Gallery
            </Button>
          </Link>
          <Link href="/admin/gallery/new">
            <Button size="sm" className="bg-accent hover:bg-accent-hover text-white font-bold">
              <Plus className="w-4 h-4 mr-1.5" /> Add New Work
            </Button>
          </Link>
        </div>
      </div>

      {/* Gallery Items Table / Cards */}
      <div className="bg-background-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-accent" /> Published Works ({items.length})
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mx-auto">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold">No gallery works yet</h3>
            <p className="text-sm text-foreground-muted max-w-sm mx-auto">
              Start by uploading photographs of your finished 3D printed items.
            </p>
            <Link href="/admin/gallery/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Your First Work
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-background-secondary text-xs uppercase text-foreground-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4">Work / Preview</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Specs & Tags</th>
                  <th className="px-6 py-4 text-center">Featured</th>
                  <th className="px-6 py-4 text-center">Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-background-hover/50 transition-colors">
                    {/* Preview & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-2xl bg-background-secondary border border-border overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-xs">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-foreground-muted line-clamp-1 max-w-xs">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                        {item.category}
                      </span>
                    </td>

                    {/* Specs & Tags */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {item.dimensions && (
                          <p className="text-xs text-foreground font-medium">{item.dimensions}</p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <p className="text-[11px] text-foreground-muted truncate max-w-[200px]">
                            {item.tags.join(', ')}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Featured */}
                    <td className="px-6 py-4 text-center">
                      {item.is_featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/30">
                          <Sparkles className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-xs text-foreground-muted">No</span>
                      )}
                    </td>

                    {/* Sort Order */}
                    <td className="px-6 py-4 text-center font-mono text-xs text-foreground-muted">
                      {item.sort_order}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <GalleryItemActions item={item} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
