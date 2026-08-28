'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Upload, ArrowLeft, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { createGalleryItem, updateGalleryItem } from '@/lib/actions/gallery';
import { GALLERY_CATEGORIES } from '@/lib/demo-gallery';
import type { GalleryItem } from '@/types';

type GalleryFormProps = {
  initialData?: GalleryItem | null;
  isEdit?: boolean;
};

export default function GalleryForm({ initialData, isEdit = false }: GalleryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url || '');
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image_url || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      let result;
      if (isEdit && initialData?.id) {
        result = await updateGalleryItem(initialData.id, formData);
      } else {
        result = await createGalleryItem(formData);
      }

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push('/admin/gallery');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving the gallery item.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const categoryOptions = GALLERY_CATEGORIES.filter((c) => c !== 'All').map((c) => ({
    value: c,
    label: c,
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5DCD0]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/gallery"
            className="p-2 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E5DCD0] text-[#786C5E] hover:text-[#1E1813] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1E1813]">
              {isEdit ? `Edit: ${initialData?.title}` : 'Add New Gallery Work'}
            </h1>
            <p className="text-xs text-[#6B5E51]">
              {isEdit
                ? 'Update details and specifications for this gallery item.'
                : 'Upload a completed figure photo to showcase in the public portfolio.'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E5DCD0] p-6 space-y-4 shadow-xs">
            <h2 className="font-serif font-bold text-base text-[#1E1813] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#B45309]" /> Work Photograph
            </h2>

            {/* Image Preview Box */}
            <div className="relative aspect-square w-full rounded-2xl bg-[#F7F3EB] border-2 border-dashed border-[#DDD3C4] overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <div className="text-center p-4 text-[#9C8F80] space-y-2">
                  <Upload className="w-10 h-10 mx-auto text-[#9C8F80]" />
                  <p className="text-xs">No image selected yet</p>
                </div>
              )}
            </div>

            {/* File Upload Input */}
            <div>
              <label className="block text-xs font-semibold text-[#2D231B] uppercase tracking-wider mb-2">
                Upload New Image File
              </label>
              <input
                type="file"
                name="image_file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="w-full text-xs text-[#6B5E51] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#B45309] file:text-white hover:file:bg-[#9A3412] cursor-pointer"
              />
            </div>

            {/* Direct Image URL fallback */}
            <div className="pt-3 border-t border-[#EAE2D5]">
              <Input
                id="image_url"
                name="image_url"
                label="Or Image URL / Path"
                placeholder="/images/products/figure.png or https://..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                }}
              />
              <p className="text-[11px] text-[#786C5E] mt-1">
                You can paste local paths like <code>/images/products/itachi.png</code> or remote URLs.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Metadata */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5DCD0] p-6 md:p-8 space-y-6 shadow-xs">
            <h2 className="font-serif font-bold text-base text-[#1E1813] border-b border-[#EAE2D5] pb-3">Item Details</h2>

            {/* Title */}
            <Input
              id="title"
              name="title"
              label="Figure / Item Title *"
              placeholder="e.g., Superior Spider-Man Statue"
              required
              defaultValue={initialData?.title || ''}
            />

            {/* Category */}
            <Select
              id="category"
              name="category"
              label="Portfolio Category *"
              defaultValue={initialData?.category || 'Action Figures'}
              options={categoryOptions}
            />

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-[#2D231B] mb-1.5">
                Description & Crafting Notes
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={initialData?.description || ''}
                placeholder="Details on the sculpt, painting techniques, or backstory..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-white focus:bg-white border border-[#DDD3C4] text-[#1E1813] text-sm focus:outline-none focus:ring-2 focus:ring-[#B45309]/30 focus:border-[#B45309]"
              />
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="dimensions"
                name="dimensions"
                label="Dimensions / Height"
                placeholder="e.g., 22cm Height"
                defaultValue={initialData?.dimensions || ''}
              />
              <Input
                id="material"
                name="material"
                label="Material & Finish"
                placeholder="e.g., Hand-Painted Resin / PLA"
                defaultValue={initialData?.material || 'High-Detail Resin & PLA'}
              />
            </div>

            {/* Tags */}
            <div>
              <Input
                id="tags"
                name="tags"
                label="Tags (Comma Separated)"
                placeholder="Anime, Naruto, Hand Painted, Resin"
                defaultValue={initialData?.tags?.join(', ') || ''}
              />
              <p className="text-xs text-[#786C5E] mt-1">Helps customers search by keywords in the gallery.</p>
            </div>

            {/* Sort Order & Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EAE2D5] items-center">
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                label="Sort Order"
                placeholder="0"
                defaultValue={String(initialData?.sort_order ?? 0)}
              />

              <div className="space-y-3 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    value="true"
                    defaultChecked={initialData?.is_featured ?? true}
                    className="w-4 h-4 accent-[#B45309] rounded"
                  />
                  <div>
                    <span className="text-sm font-semibold text-[#1E1813] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#B45309]" /> Feature on Homepage
                    </span>
                    <span className="block text-xs text-[#786C5E]">Showcase in the home page works section</span>
                  </div>
                </label>

                {isEdit && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      value="true"
                      defaultChecked={initialData?.is_active ?? true}
                      className="w-4 h-4 accent-[#B45309] rounded"
                    />
                    <div>
                      <span className="text-sm font-semibold text-[#1E1813]">Visible in Gallery</span>
                      <span className="block text-xs text-[#786C5E]">Uncheck to hide without deleting</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-[#EAE2D5] flex items-center justify-end gap-3">
              <Link href="/admin/gallery">
                <Button variant="outline" type="button" className="border-[#D6C7B7] text-[#2D231B]">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="bg-[#B45309] hover:bg-[#9A3412] text-white font-bold">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : isEdit ? (
                  'Update Gallery Work'
                ) : (
                  'Publish to Gallery'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
