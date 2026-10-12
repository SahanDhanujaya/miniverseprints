CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  category TEXT NOT NULL DEFAULT 'final_output' CHECK (category IN ('printing_process', 'final_output')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active gallery items are publicly readable"
  ON public.gallery_items FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage gallery items"
  ON public.gallery_items FOR ALL
  USING (public.is_admin());
