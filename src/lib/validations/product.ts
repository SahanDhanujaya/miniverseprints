import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  sku: z.string().optional(),
  short_description: z.string().max(300, 'Short description must be under 300 characters').optional(),
  full_description: z.string().optional(),
  regular_price: z.coerce.number().min(0, 'Price must be positive'),
  sale_price: z.coerce.number().min(0, 'Sale price must be positive').optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0, 'Stock must be 0 or more').default(0),
  low_stock_threshold: z.coerce.number().int().min(0).default(5),
  product_type: z.enum(['ready_stock', 'made_to_order']).default('ready_stock'),
  production_lead_time_days: z.coerce.number().int().min(0).optional().nullable(),
  weight_grams: z.coerce.number().int().min(0).optional().nullable(),
  material: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_new_arrival: z.boolean().default(false),
  is_best_seller: z.boolean().default(false),
  is_active: z.boolean().default(true),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  category_ids: z.array(z.string().uuid()).optional(),
  tag_ids: z.array(z.string().uuid()).optional(),
});

export const productVariationSchema = z.object({
  sku: z.string().optional(),
  size: z.string().optional(),
  height: z.string().optional(),
  colour: z.string().optional(),
  paint_type: z.enum(['painted', 'unpainted']).optional().nullable(),
  material: z.string().optional(),
  finish: z.string().optional(),
  price_adjustment: z.coerce.number().default(0),
  stock_quantity: z.coerce.number().int().min(0).default(0),
  image_url: z.string().optional(),
  production_lead_time_days: z.coerce.number().int().min(0).optional().nullable(),
  is_active: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  image_url: z.string().optional(),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export const tagSchema = z.object({
  name: z.string().min(2, 'Tag name is required'),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariationInput = z.infer<typeof productVariationSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type TagInput = z.infer<typeof tagSchema>;
