import { z } from 'zod';

export const customOrderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  whatsapp: z.string().min(8, 'Enter a valid WhatsApp contact number'),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  character_name: z.string().min(2, 'Character or figure name is required'),
  size: z.string().optional(),
  paint_type: z.string().optional(),
  required_date: z.string().optional(),
  budget: z.string().optional(),
  description: z.string().optional(),
  agree_terms: z.boolean().optional(),
});

export type CustomOrderInput = z.infer<typeof customOrderSchema>;
