import { z } from 'zod';

export const couponSchema = z.object({
  code: z.string().min(2, 'Coupon code is required').max(50),
  type: z.enum(['percentage', 'fixed_order', 'fixed_product', 'free_delivery']),
  value: z.coerce.number().min(0, 'Value must be positive'),
  min_order_amount: z.coerce.number().min(0).optional().default(0),
  max_order_amount: z.coerce.number().min(0).optional().nullable(),
  usage_limit: z.coerce.number().int().min(0).optional().nullable(),
  per_customer_limit: z.coerce.number().int().min(1).default(1),
  starts_at: z.string().min(1, 'Start date is required'),
  expires_at: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  category_ids: z.array(z.string().uuid()).optional(),
  product_ids: z.array(z.string().uuid()).optional(),
});

export type CouponInput = z.infer<typeof couponSchema>;
