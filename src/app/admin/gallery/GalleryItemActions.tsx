'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Sparkles, Eye, Loader2 } from 'lucide-react';
import { deleteGalleryItem, toggleGalleryItemFeatured } from '@/lib/actions/gallery';

type GalleryItemActionsProps = {
  item: {
    id: string;
    title: string;
    is_featured: boolean;
  };
};

export default function GalleryItemActions({ item }: GalleryItemActionsProps) {
  const [loading, setLoading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(item.is_featured);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to remove "${item.title}" from the gallery?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await deleteGalleryItem(item.id);
      if (res?.error) {
        alert(res.error);
      }
    } catch {
      alert('Failed to delete item.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async () => {
    setLoading(true);
    try {
      const nextState = !isFeatured;
      setIsFeatured(nextState);
      await toggleGalleryItemFeatured(item.id, nextState);
    } catch {
      setIsFeatured(isFeatured);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Toggle Featured */}
      <button
        onClick={handleToggleFeatured}
        disabled={loading}
        title={isFeatured ? 'Featured on Home Showcase' : 'Mark as Featured'}
        className={`p-2 rounded-xl border transition-colors ${
          isFeatured
            ? 'bg-accent/20 border-accent text-accent'
            : 'bg-background hover:bg-background-hover border-border text-foreground-muted'
        }`}
      >
        <Sparkles className="w-4 h-4" />
      </button>

      {/* Edit Link */}
      <Link
        href={`/admin/gallery/${item.id}/edit`}
        className="p-2 rounded-xl bg-background hover:bg-background-hover border border-border text-foreground-muted hover:text-foreground transition-colors"
        title="Edit item"
      >
        <Edit2 className="w-4 h-4" />
      </Link>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-2 rounded-xl bg-background hover:bg-error/10 border border-border hover:border-error text-foreground-muted hover:text-error transition-colors"
        title="Delete item"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
