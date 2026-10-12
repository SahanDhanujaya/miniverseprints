-- Add the wall-frame catalog category for the storefront and admin product form.
INSERT INTO public.categories (name, slug, description, sort_order, is_active)
VALUES (
  '3D Wall Frames',
  '3d-wall-frames',
  'Decorative 3D-printed wall frames and display art',
  8,
  true
)
ON CONFLICT (slug) DO NOTHING;
