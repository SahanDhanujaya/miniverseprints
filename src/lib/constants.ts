// MiniVersePrints Constants

export const SITE_NAME = 'MiniVersePrints';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://miniverseprints.lk';
export const WHATSAPP_NUMBER = '+94782525156';
export const WHATSAPP_LINK = `https://wa.me/94782525156`;
export const GOOGLE_REVIEWS_LINK = 'https://maps.app.goo.gl/1yp6xwX9GK4c7Ap58';
export const GOOGLE_REVIEW_SEARCH_QUERY = 'MiniVersePrints Sri Lanka';
export const CURRENCY = 'LKR';
export const CURRENCY_SYMBOL = 'Rs.';

export const ORDER_STATUSES = [
  { value: 'pending_payment', label: 'Pending Payment', color: '#F59E0B' },
  { value: 'payment_verification', label: 'Payment Verification', color: '#F59E0B' },
  { value: 'confirmed', label: 'Confirmed', color: '#3B82F6' },
  { value: 'printing', label: 'Printing', color: '#8B5CF6' },
  { value: 'post_processing', label: 'Post Processing', color: '#8B5CF6' },
  { value: 'painting', label: 'Painting', color: '#8B5CF6' },
  { value: 'quality_checking', label: 'Quality Checking', color: '#8B5CF6' },
  { value: 'ready_for_dispatch', label: 'Ready for Dispatch', color: '#22C55E' },
  { value: 'dispatched', label: 'Dispatched', color: '#06B6D4' },
  { value: 'delivered', label: 'Delivered', color: '#22C55E' },
  { value: 'completed', label: 'Completed', color: '#22C55E' },
  { value: 'cancelled', label: 'Cancelled', color: '#EF4444' },
  { value: 'refunded', label: 'Refunded', color: '#EF4444' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'payhere', label: 'PayHere Online Payment', description: 'Pay securely with PayHere' },
  { value: 'cod', label: 'Cash on Delivery', description: 'Pay when you receive your order' },
  { value: 'bank_transfer', label: 'Direct Bank Transfer', description: 'Transfer to our bank account' },
  { value: 'store_pickup', label: 'Store Pickup', description: 'Pick up from our store' },
] as const;

export const SRI_LANKA_PROVINCES = [
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
] as const;

export const SRI_LANKA_DISTRICTS: Record<string, string[]> = {
  Western: ['Colombo', 'Gampaha', 'Kalutara'],
  Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  Southern: ['Galle', 'Matara', 'Hambantota'],
  Northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  Eastern: ['Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  Uva: ['Badulla', 'Monaragala'],
  Sabaragamuwa: ['Ratnapura', 'Kegalle'],
};

export const PRODUCT_TYPES = [
  { value: 'ready_stock', label: 'Ready Stock' },
  { value: 'made_to_order', label: 'Made to Order' },
] as const;

export const COUPON_TYPES = [
  { value: 'percentage', label: 'Percentage Discount' },
  { value: 'fixed_order', label: 'Fixed Order Discount' },
  { value: 'fixed_product', label: 'Fixed Product Discount' },
  { value: 'free_delivery', label: 'Free Delivery' },
] as const;

export const CUSTOM_ORDER_STATUSES = [
  { value: 'new_request', label: 'New Request', color: '#3B82F6' },
  { value: 'reviewing', label: 'Reviewing', color: '#F59E0B' },
  { value: 'quotation_sent', label: 'Quotation Sent', color: '#8B5CF6' },
  { value: 'customer_approved', label: 'Customer Approved', color: '#22C55E' },
  { value: 'deposit_pending', label: 'Deposit Pending', color: '#F59E0B' },
  { value: 'in_production', label: 'In Production', color: '#8B5CF6' },
  { value: 'completed', label: 'Completed', color: '#22C55E' },
  { value: 'rejected', label: 'Rejected', color: '#EF4444' },
] as const;

export const PRODUCTS_PER_PAGE = 48;
export const REVIEWS_PER_PAGE = 10;
export const ORDERS_PER_PAGE = 10;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
