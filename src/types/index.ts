// MiniVersePrints TypeScript Type Definitions

export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  district: string;
  province: string;
  postal_code: string | null;
  is_default: boolean;
  type: 'shipping' | 'billing';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export type ProductType = 'ready_stock' | 'made_to_order';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  full_description: string | null;
  regular_price: number;
  sale_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  product_type: ProductType;
  production_lead_time_days: number | null;
  weight_grams: number | null;
  dimensions: Record<string, string> | null;
  material: string | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  images?: ProductImage[];
  product_images?: ProductImage[];
  categories?: Category[];
  tags?: Tag[];
  variations?: ProductVariation[];
  attributes?: ProductAttribute[];
  average_rating?: number;
  review_count?: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_main: boolean;
  created_at: string;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  sku: string | null;
  size: string | null;
  height: string | null;
  colour: string | null;
  paint_type: 'painted' | 'unpainted' | null;
  material: string | null;
  finish: string | null;
  price_adjustment: number;
  stock_quantity: number;
  image_url: string | null;
  production_lead_time_days: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductAttribute {
  id: string;
  product_id: string;
  name: string;
  value: string;
  created_at: string;
}

export interface Cart {
  id: string;
  user_id: string;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
  coupon?: Coupon | null;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variation_id: string | null;
  quantity: number;
  created_at: string;
  product?: Product;
  variation?: ProductVariation;
}

export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_verification'
  | 'confirmed'
  | 'printing'
  | 'post_processing'
  | 'painting'
  | 'quality_checking'
  | 'ready_for_dispatch'
  | 'dispatched'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'payhere' | 'cod' | 'bank_transfer' | 'store_pickup';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'verifying';

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress | null;
  notes: string | null;
  admin_notes: string | null;
  subtotal: number;
  discount: number;
  delivery_charge: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  coupon_id: string | null;
  courier_name: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  statusHistory?: OrderStatusHistory[];
  payment?: Payment;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variation_id: string | null;
  product_name: string;
  variation_details: Record<string, string> | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  payhere_payment_id: string | null;
  payhere_checksum: string | null;
  bank_reference: string | null;
  payment_slip_url: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  district: string;
  province: string;
  postal_code?: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  districts: string[];
  is_active: boolean;
  created_at: string;
  rates?: ShippingRate[];
}

export interface ShippingRate {
  id: string;
  zone_id: string;
  rate_type: 'flat' | 'weight_based' | 'free';
  base_rate: number;
  per_kg_rate: number | null;
  free_delivery_threshold: number | null;
  estimated_days_min: number | null;
  estimated_days_max: number | null;
  created_at: string;
}

export type CouponType = 'percentage' | 'fixed_order' | 'fixed_product' | 'free_delivery';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  min_order_amount: number;
  max_order_amount: number | null;
  usage_limit: number | null;
  per_customer_limit: number;
  starts_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  categories?: Category[];
  products?: Product[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  admin_reply: string | null;
  admin_reply_at: string | null;
  created_at: string;
  updated_at: string;
  user?: Profile;
  images?: ReviewImage[];
}

export interface ReviewImage {
  id: string;
  review_id: string;
  image_url: string;
  created_at: string;
}

export interface CustomOrderRequest {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  whatsapp: string;
  character_name: string;
  size: string | null;
  paint_type: 'painted' | 'unpainted' | null;
  required_date: string | null;
  budget: string | null;
  description: string | null;
  status: 'new_request' | 'reviewing' | 'quotation_sent' | 'customer_approved' | 'deposit_pending' | 'in_production' | 'completed' | 'rejected';
  created_at: string;
  updated_at: string;
  images?: CustomOrderImage[];
}

export interface CustomOrderImage {
  id: string;
  custom_order_id: string;
  image_url: string;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface BankDetail {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch: string | null;
  is_active: boolean;
  created_at: string;
}
