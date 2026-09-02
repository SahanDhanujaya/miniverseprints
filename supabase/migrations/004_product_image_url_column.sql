-- Ensure products can persist a primary image URL for storefront rendering.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_url TEXT;

UPDATE public.products p
SET image_url = (
  SELECT pi.url
  FROM public.product_images pi
  WHERE pi.product_id = p.id
  ORDER BY pi.is_main DESC, pi.created_at ASC
  LIMIT 1
)
WHERE p.image_url IS NULL;
