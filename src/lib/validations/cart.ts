import { z } from 'zod';

export const cartItemSchema = z.object({
  product_id: z.string().uuid('Invalid product'),
  variation_id: z.string().uuid('Invalid variation').optional().nullable(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Maximum 99 items'),
});

export const updateCartItemSchema = z.object({
  id: z.string().uuid('Invalid cart item'),
  quantity: z.number().int().min(0, 'Quantity must be at least 0').max(99, 'Maximum 99 items'),
});

export const couponCodeSchema = z.object({
  code: z.string().min(1, 'Please enter a coupon code').max(50, 'Coupon code is too long'),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CouponCodeInput = z.infer<typeof couponCodeSchema>;
