import type { Product, ProductAttribute } from '@/types';

export function resolveProductModelUrl(
  product?: Partial<Product> & {
    model_url?: string | null;
    product_attributes?: ProductAttribute[];
    attributes?: ProductAttribute[];
  } | null,
): string | null {
  if (!product) return null;

  console.log(product, product.name)

  const directModelUrl = typeof product.model_url === 'string' ? product.model_url.trim() : '';
  if (directModelUrl) return directModelUrl;

  const attributes = [
    ...(product.attributes || []),
    ...(product.product_attributes || []),
  ];

  const attributeModelUrl = attributes.find(
    (attribute) => attribute?.name === 'model_url' && typeof attribute.value === 'string' && attribute.value.trim(),
  )?.value;

  return attributeModelUrl?.trim() || null;
}

export function hasProductPreview(product?: Partial<Product> | null): boolean {
  return Boolean(resolveProductModelUrl(product as any));
}

export function isSupabaseStorageUrl(url?: string | null): boolean {
  if (!url) return false;
  const supabaseBase = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // If no Supabase config is present (demo/local mode), accept any URL so demo data displays.
  if (!supabaseBase) return true;
  try {
    const u = String(url);
    // Common acceptance rules for Supabase public storage URLs:
    // - Absolute URLs that include '/storage/v1/object/public/'
    // - Absolute URLs that start with the configured NEXT_PUBLIC_SUPABASE_URL
    // - Relative paths that start with '/storage/v1/object/public/'
    const normalizedBase = supabaseBase.replace(/\/$/, '');
    if (u.includes('/storage/v1/object/public/')) return true;
    if (u.startsWith(normalizedBase)) return true;
    if (u.startsWith('/storage/v1/object/public/')) return true;
    // Also allow cases where the storage is served through a different host (CDN)
    // by checking for just the '/storage/v1/object/public/' segment above.
    return false;
  } catch (e) {
    return false;
  }
}

export function hasSupabasePreview(product?: Partial<Product> | null): boolean {
  if (!product) return false;

  const modelUrl = resolveProductModelUrl(product as any);
  console.log('modelUrl', modelUrl);

  const productImages = (product as any).images?.length ? (product as any).images : (product as any).product_images || [];
  const fallbackMainImage = (product as any).image_url ? (product as any).image_url : null;
  const mainImage = productImages.find((img: any) => img?.is_main) || productImages[0] || (fallbackMainImage ? { url: fallbackMainImage } : null);
  const imageUrl = mainImage ? (mainImage.url || mainImage) : null;

  if (!imageUrl) return false;
    // Primary rule: show product in gallery if its `image_url` points to Supabase storage
    const directImage = typeof (product as any).image_url === 'string' ? (product as any).image_url : null;
    if (directImage && isSupabaseStorageUrl(directImage)) return true;

    // Fallback: check product_images / images array for a main image hosted in Supabase
    if (imageUrl && isSupabaseStorageUrl(typeof imageUrl === 'string' ? imageUrl : (imageUrl.url || null))) return true;

    return false;
}

  export function hasSupabaseModel(product?: Partial<Product> | null): boolean {
    if (!product) return false;
    const modelUrl = resolveProductModelUrl(product as any);
    return Boolean(modelUrl && isSupabaseStorageUrl(modelUrl));
  }
