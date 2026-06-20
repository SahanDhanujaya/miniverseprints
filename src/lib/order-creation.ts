import type { CheckoutInput } from './validations/checkout';
import type { PaymentMethod } from '@/types';

export interface OrderAmounts {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
}

export function getInitialOrderState(paymentMethod: PaymentMethod) {
  return {
    status: paymentMethod === 'cod' ? 'confirmed' : 'pending_payment',
    payment_status: 'pending',
  } as const;
}

export function buildCheckoutAddresses(data: CheckoutInput) {
  const shippingAddress = {
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
    address_line_1: data.address_line_1,
    address_line_2: data.address_line_2,
    city: data.city,
    district: data.district,
    province: data.province,
    postal_code: data.postal_code,
  };

  const billingAddress = data.different_billing ? {
    first_name: data.billing_first_name,
    last_name: data.billing_last_name,
    phone: data.billing_phone,
    address_line_1: data.billing_address_line_1,
    address_line_2: data.billing_address_line_2,
    city: data.billing_city,
    district: data.billing_district,
    province: data.billing_province,
    postal_code: data.billing_postal_code,
  } : shippingAddress;

  return { shippingAddress, billingAddress };
}

export function buildOrderInsert(
  data: CheckoutInput,
  orderNumber: string,
  userId: string,
  amounts: OrderAmounts
) {
  const { shippingAddress, billingAddress } = buildCheckoutAddresses(data);
  const state = getInitialOrderState(data.payment_method);

  return {
    order_number: orderNumber,
    user_id: userId,
    status: state.status,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    shipping_address: shippingAddress,
    billing_address: billingAddress,
    notes: data.notes,
    subtotal: amounts.subtotal,
    discount: amounts.discount,
    delivery_charge: amounts.deliveryCharge,
    total: amounts.total,
    payment_method: data.payment_method,
    payment_status: state.payment_status,
  };
}
