import { z } from 'zod';

export const customOrderSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  whatsapp: z.string().regex(/^(?:\+94|0)7[0-9]{8}$/, 'Enter a valid Sri Lankan mobile number'),
  character_name: z.string().min(2, 'Character/figure name is required'),
  size: z.string().optional(),
  paint_type: z.enum(['painted', 'unpainted']).optional().nullable(),
  required_date: z.string().optional().nullable(),
  budget: z.string().optional(),
  description: z.string().max(2000, 'Description must be under 2000 characters').optional(),
  agree_terms: z.literal(true, { message: 'You must agree to the terms' }),
});

export type CustomOrderInput = z.infer<typeof customOrderSchema>;
