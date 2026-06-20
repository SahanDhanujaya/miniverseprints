import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().optional(),
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  phone: z.string().regex(/^(?:\+94|0)7[0-9]{8}$/, 'Enter a valid Sri Lankan mobile number'),
  address_line_1: z.string().min(5, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  district: z.string().min(2, 'District is required'),
  province: z.string().min(2, 'Province is required'),
  postal_code: z.string().optional(),
  is_default: z.boolean().optional(),
  type: z.enum(['shipping', 'billing']).default('shipping'),
});

export const checkoutSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().regex(/^(?:\+94|0)7[0-9]{8}$/, 'Enter a valid Sri Lankan mobile number'),
  address_line_1: z.string().min(5, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  district: z.string().min(2, 'District is required'),
  province: z.string().min(2, 'Province is required'),
  postal_code: z.string().optional(),
  notes: z.string().optional(),
  payment_method: z.enum(['payhere', 'cod', 'bank_transfer', 'store_pickup'], {
    message: 'Please select a payment method',
  }),
  shipping_zone_id: z.string().uuid('Please select a delivery option'),
  // Different billing address
  different_billing: z.boolean().optional(),
  billing_first_name: z.string().optional(),
  billing_last_name: z.string().optional(),
  billing_phone: z.string().optional(),
  billing_address_line_1: z.string().optional(),
  billing_address_line_2: z.string().optional(),
  billing_city: z.string().optional(),
  billing_district: z.string().optional(),
  billing_province: z.string().optional(),
  billing_postal_code: z.string().optional(),
}).refine(
  (data) => {
    if (data.different_billing) {
      return !!data.billing_first_name && !!data.billing_last_name && !!data.billing_address_line_1 && !!data.billing_city && !!data.billing_district && !!data.billing_province;
    }
    return true;
  },
  {
    message: 'Billing address fields are required when different billing is selected',
    path: ['different_billing'],
  }
);

export const bankPaymentSchema = z.object({
  bank_reference: z.string().min(4, 'Please enter the bank reference number'),
  payment_slip: z.any().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type BankPaymentInput = z.infer<typeof bankPaymentSchema>;
