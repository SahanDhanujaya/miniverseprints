import { getEffectivePrice, getVariationPrice } from './utils';

export interface PricingCartItem {
  quantity: number;
  product: {
    name: string;
    regular_price: number;
    sale_price: number | null;
    product_type: 'ready_stock' | 'made_to_order';
    stock_quantity: number;
  };
  variation?: {
    price_adjustment: number;
    stock_quantity: number;
  } | null;
}

export interface ShippingRateInput {
  rate_type: 'flat' | 'free' | 'weight_based' | 'district_based' | string;
  base_rate: number | null;
  free_delivery_threshold: number | null;
}

export interface CouponInput {
  type: 'percentage' | 'fixed_order' | 'fixed_product' | 'free_delivery';
  value: number;
}

export function calculateCartSubtotal(items: PricingCartItem[]): number {
  return items.reduce((total, item) => {
    const basePrice = getEffectivePrice(item.product.regular_price, item.product.sale_price);
    const adjustment = item.variation?.price_adjustment ?? 0;
    const unitPrice = getVariationPrice(basePrice, adjustment);
    return total + unitPrice * item.quantity;
  }, 0);
}

export function calculateDeliveryCharge(subtotal: number, shippingRate?: ShippingRateInput | null): number {
  if (!shippingRate || shippingRate.rate_type === 'free') return 0;
  if (shippingRate.free_delivery_threshold && subtotal >= shippingRate.free_delivery_threshold) return 0;
  return shippingRate.base_rate ?? 0;
}

export function calculateDiscount(subtotal: number, coupon?: CouponInput | null): number {
  if (!coupon) return 0;

  if (coupon.type === 'percentage') {
    return Math.min(subtotal, subtotal * (coupon.value / 100));
  }

  if (coupon.type === 'fixed_order' || coupon.type === 'fixed_product') {
    return Math.min(subtotal, coupon.value);
  }

  return 0;
}

export function calculateCheckoutTotals(
  items: PricingCartItem[],
  shippingRate?: ShippingRateInput | null,
  coupon?: CouponInput | null
) {
  const subtotal = calculateCartSubtotal(items);
  const discount = calculateDiscount(subtotal, coupon);
  const deliveryCharge = coupon?.type === 'free_delivery'
    ? 0
    : calculateDeliveryCharge(subtotal, shippingRate);
  const total = Math.max(0, subtotal - discount + deliveryCharge);

  return { subtotal, discount, deliveryCharge, total };
}

export function validateReadyStock(items: PricingCartItem[]): string | null {
  for (const item of items) {
    if (item.product.product_type !== 'ready_stock') continue;

    const availableStock = item.variation?.stock_quantity ?? item.product.stock_quantity;
    if (item.quantity > availableStock) {
      return `${item.product.name} has only ${availableStock} items available`;
    }
  }

  return null;
}
