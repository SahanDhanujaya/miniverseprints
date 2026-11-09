const PLACEHOLDER_IMAGE = '/images/placeholder-product.svg';

/**
 * Normalise URLs saved by older uploads. Some records contain an already
 * percent-encoded filename (for example `%2520` instead of `%20`).
 */
export function normalizeMediaUrl(value: string | null | undefined): string {
  if (!value) return PLACEHOLDER_IMAGE;

  try {
    const url = new URL(value, 'http://local.invalid');
    let pathname = url.pathname;

    if (pathname.includes('%25')) {
      pathname = decodeURIComponent(pathname);
      url.pathname = pathname;
    }

    return value.startsWith('/') ? `${url.pathname}${url.search}${url.hash}` : url.toString().replace('http://local.invalid', '');
  } catch {
    return value;
  }
}

/**
 * Use Supabase Image Transformation for public storage assets. This keeps
 * browser delivery reliable while avoiding multi-megabyte originals in cards.
 */
export function getMediaUrl(value: string | null | undefined, width = 640): string {
  const normalized = normalizeMediaUrl(value);
  if (!normalized.includes('/storage/v1/object/public/')) return normalized;

  const transformed = normalized.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
  const separator = transformed.includes('?') ? '&' : '?';
  return `${transformed}${separator}width=${width}&quality=78&resize=contain`;
}

export { PLACEHOLDER_IMAGE };
