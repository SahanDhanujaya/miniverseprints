-- MiniVersePrints Gallery Items Schema
-- Run this migration in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Figures',
  image_url TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  dimensions TEXT,
  material TEXT DEFAULT 'PLA / Resin',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for querying
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON public.gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_items_featured ON public.gallery_items(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_gallery_items_active ON public.gallery_items(is_active);

-- Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Public can read active gallery items
CREATE POLICY "Gallery items are publicly viewable"
  ON public.gallery_items FOR SELECT
  USING (true);

-- Admins can do everything
CREATE POLICY "Admins can manage gallery items"
  ON public.gallery_items FOR ALL
  USING (public.is_admin());

-- Update timestamp trigger
CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
