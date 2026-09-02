import type { Product, ProductAttribute } from '@/types';

export function resolveProductModelUrl(
  product?: Partial<Product> & {
    model_url?: string | null;
    product_attributes?: ProductAttribute[];
    attributes?: ProductAttribute[];
  } | null,
): string | null {
  if (!product) return null;

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
