import { z } from 'zod';

export const reviewSchema = z.object({
  product_id: z.string().uuid('Invalid product'),
  rating: z.number().int().min(1, 'Please select a rating').max(5, 'Maximum 5 stars'),
  title: z.string().max(100, 'Title must be under 100 characters').optional(),
  body: z.string().max(2000, 'Review must be under 2000 characters').optional(),
});

export const reviewReportSchema = z.object({
  review_id: z.string().uuid('Invalid review'),
  reason: z.string().min(5, 'Please provide a reason').max(500, 'Reason must be under 500 characters'),
});

export const reviewReplySchema = z.object({
  admin_reply: z.string().min(1, 'Reply cannot be empty').max(1000, 'Reply must be under 1000 characters'),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewReportInput = z.infer<typeof reviewReportSchema>;
export type ReviewReplyInput = z.infer<typeof reviewReplySchema>;
