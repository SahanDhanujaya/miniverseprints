-- MiniVersePrints Row Level Security Policies
-- Run after 001_initial_schema.sql

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_callbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_order_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_order_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_details ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- PROFILES
-- ============================================
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- ============================================
-- ADDRESSES
-- ============================================
CREATE POLICY "Users can view own addresses"
  ON public.addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON public.addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON public.addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON public.addresses FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CATEGORIES (public read, admin write)
-- ============================================
CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.is_admin());

-- ============================================
-- TAGS (public read, admin write)
-- ============================================
CREATE POLICY "Tags are publicly readable"
  ON public.tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tags"
  ON public.tags FOR ALL
  USING (public.is_admin());

-- ============================================
-- PRODUCTS (public read active, admin full)
-- ============================================
CREATE POLICY "Active products are publicly readable"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- ============================================
-- PRODUCT IMAGES (public read, admin write)
-- ============================================
CREATE POLICY "Product images are publicly readable"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product images"
  ON public.product_images FOR ALL
  USING (public.is_admin());

-- ============================================
-- PRODUCT CATEGORIES (public read, admin write)
-- ============================================
CREATE POLICY "Product categories are publicly readable"
  ON public.product_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product categories"
  ON public.product_categories FOR ALL
  USING (public.is_admin());

-- ============================================
-- PRODUCT TAGS (public read, admin write)
-- ============================================
CREATE POLICY "Product tags are publicly readable"
  ON public.product_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product tags"
  ON public.product_tags FOR ALL
  USING (public.is_admin());

-- ============================================
-- PRODUCT ATTRIBUTES (public read, admin write)
-- ============================================
CREATE POLICY "Product attributes are publicly readable"
  ON public.product_attributes FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product attributes"
  ON public.product_attributes FOR ALL
  USING (public.is_admin());

-- ============================================
-- PRODUCT VARIATIONS (public read, admin write)
-- ============================================
CREATE POLICY "Product variations are publicly readable"
  ON public.product_variations FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product variations"
  ON public.product_variations FOR ALL
  USING (public.is_admin());

-- ============================================
-- CARTS
-- ============================================
CREATE POLICY "Users can view own cart"
  ON public.carts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cart"
  ON public.carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON public.carts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart"
  ON public.carts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CART ITEMS
-- ============================================
CREATE POLICY "Users can view own cart items"
  ON public.cart_items FOR SELECT
  USING (cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own cart items"
  ON public.cart_items FOR INSERT
  WITH CHECK (cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own cart items"
  ON public.cart_items FOR UPDATE
  USING (cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own cart items"
  ON public.cart_items FOR DELETE
  USING (cart_id IN (SELECT id FROM public.carts WHERE user_id = auth.uid()));

-- ============================================
-- WISHLISTS
-- ============================================
CREATE POLICY "Users can view own wishlist"
  ON public.wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
  ON public.wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist"
  ON public.wishlists FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SHIPPING (public read, admin write)
-- ============================================
CREATE POLICY "Shipping zones are publicly readable"
  ON public.shipping_zones FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage shipping zones"
  ON public.shipping_zones FOR ALL
  USING (public.is_admin());

CREATE POLICY "Shipping rates are publicly readable"
  ON public.shipping_rates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage shipping rates"
  ON public.shipping_rates FOR ALL
  USING (public.is_admin());

-- ============================================
-- COUPONS (public read active, admin full)
-- ============================================
CREATE POLICY "Active coupons are publicly readable"
  ON public.coupons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage coupons"
  ON public.coupons FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view own coupon usage"
  ON public.coupon_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert coupon usage"
  ON public.coupon_usage FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Coupon categories are publicly readable"
  ON public.coupon_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage coupon categories"
  ON public.coupon_categories FOR ALL
  USING (public.is_admin());

CREATE POLICY "Coupon products are publicly readable"
  ON public.coupon_products FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage coupon products"
  ON public.coupon_products FOR ALL
  USING (public.is_admin());

-- ============================================
-- ORDERS
-- ============================================
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR public.is_admin());

CREATE POLICY "System can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- ============================================
-- ORDER STATUS HISTORY
-- ============================================
CREATE POLICY "Users can view own order history"
  ON public.order_status_history FOR SELECT
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR public.is_admin());

CREATE POLICY "Admins can insert order history"
  ON public.order_status_history FOR INSERT
  WITH CHECK (public.is_admin());

-- ============================================
-- PAYMENTS
-- ============================================
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()) OR public.is_admin());

CREATE POLICY "System can insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update payments"
  ON public.payments FOR UPDATE
  USING (public.is_admin());

-- ============================================
-- PAYMENT CALLBACKS (admin only)
-- ============================================
CREATE POLICY "Admins can manage payment callbacks"
  ON public.payment_callbacks FOR ALL
  USING (public.is_admin());

-- ============================================
-- REVIEWS
-- ============================================
CREATE POLICY "Approved reviews are publicly readable"
  ON public.reviews FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can insert own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update reviews"
  ON public.reviews FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Users can delete own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- REVIEW IMAGES
-- ============================================
CREATE POLICY "Review images are publicly readable"
  ON public.review_images FOR SELECT
  USING (true);

CREATE POLICY "Users can insert review images"
  ON public.review_images FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own review images"
  ON public.review_images FOR DELETE
  USING (review_id IN (SELECT id FROM public.reviews WHERE user_id = auth.uid()));

-- ============================================
-- REVIEW REPORTS
-- ============================================
CREATE POLICY "Users can report reviews"
  ON public.review_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view review reports"
  ON public.review_reports FOR SELECT
  USING (public.is_admin());

-- ============================================
-- CUSTOM ORDER REQUESTS
-- ============================================
CREATE POLICY "Users can view own custom orders"
  ON public.custom_order_requests FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create custom orders"
  ON public.custom_order_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can update custom orders"
  ON public.custom_order_requests FOR UPDATE
  USING (public.is_admin());

-- ============================================
-- CUSTOM ORDER IMAGES
-- ============================================
CREATE POLICY "Custom order images are readable by owner or admin"
  ON public.custom_order_images FOR SELECT
  USING (custom_order_id IN (SELECT id FROM public.custom_order_requests WHERE user_id = auth.uid()) OR public.is_admin());

CREATE POLICY "Users can insert custom order images"
  ON public.custom_order_images FOR INSERT
  WITH CHECK (true);

-- ============================================
-- SITE SETTINGS (public read, admin write)
-- ============================================
CREATE POLICY "Site settings are publicly readable"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin());

-- ============================================
-- HOMEPAGE BANNERS (public read, admin write)
-- ============================================
CREATE POLICY "Active banners are publicly readable"
  ON public.homepage_banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage banners"
  ON public.homepage_banners FOR ALL
  USING (public.is_admin());

-- ============================================
-- BANK DETAILS (public read active, admin write)
-- ============================================
CREATE POLICY "Active bank details are publicly readable"
  ON public.bank_details FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage bank details"
  ON public.bank_details FOR ALL
  USING (public.is_admin());
