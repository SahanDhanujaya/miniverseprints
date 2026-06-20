# MiniVersePrints

Production-ready e-commerce storefront for MiniVersePrints, a Sri Lankan 3D-printed figure, bust, miniature and collectible business.

## Stack

- Next.js 16 App Router, TypeScript, React 19
- Tailwind CSS 4
- Supabase PostgreSQL, Authentication and Storage
- Server actions and route handlers
- Zod validation
- PayHere sandbox-ready payment flow
- Jest tests for checkout calculations, permissions and order payload creation

## Local Installation

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

3. Fill in Supabase and PayHere values in `.env.local`.

4. Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Required:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYHERE_MERCHANT_ID=
PAYHERE_MERCHANT_SECRET=
PAYHERE_MODE=sandbox
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` or `PAYHERE_MERCHANT_SECRET` in client components.

## Supabase Setup

1. Create a Supabase project.
2. In SQL Editor, run migrations in order:

```text
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
```

3. Run demo data:

```text
supabase/seed.sql
```

4. Create Storage buckets:

```text
product-images
review-images
payment-slips
custom-order-references
homepage-banners
```

Use public read access for product and banner images. Keep payment slips and custom references private unless you add signed URL handling.

## First Administrator Account

1. Start the app and register at `/register`.
2. In Supabase Dashboard, open Authentication > Users.
3. Add this to the user `app_metadata`:

```json
{ "role": "admin" }
```

4. Ensure the matching row in `profiles` has `role = 'admin'`.
5. Log out and back in, then open `/admin`.

## Adding Products

1. Go to `/admin/products/new`.
2. Add name, slug/SKU, descriptions, LKR pricing, stock, product type, category, tags and SEO fields.
3. Use Supabase Storage URLs for placeholder or final product images.
4. Mark items as featured, new arrival or best seller as needed.
5. Use `/admin/categories`, `/admin/tags`, `/admin/shipping`, `/admin/coupons`, `/admin/banners` and `/admin/settings` for store management.

## PayHere Sandbox Setup

1. Create a PayHere sandbox merchant account.
2. Put sandbox merchant credentials in `.env.local`.
3. Keep `PAYHERE_MODE=sandbox`.
4. Configure notification URL:

```text
https://your-domain.com/api/payhere/notify
```

For local testing, expose the dev server with a tunnel and use the tunneled notify URL.

Payment hashes are generated server-side in `/api/payhere/hash`. The merchant secret is not sent to the browser. Payment notifications are verified server-side before orders are marked paid.

To switch to live mode:

1. Replace sandbox merchant credentials with live credentials.
2. Set `PAYHERE_MODE=live`.
3. Update PayHere return, cancel and notify URLs to the production Vercel domain.
4. Run a low-value live test order before announcing online payments.

## Vercel Deployment

1. Push the project to a Git provider.
2. Import it in Vercel.
3. Add every variable from `.env.example` to Vercel Project Settings > Environment Variables.
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
5. Deploy.
6. In Supabase, add the Vercel URL to Auth redirect URLs.
7. In PayHere, set production return/cancel/notify URLs.

## Useful Commands

```bash
npm run dev
npm run lint
npm test
npm run build
```

## Test Checklist

- Home page loads with hero, product sections, categories, reviews and WhatsApp button.
- Shop search, filters, sorting and pagination work on mobile and desktop.
- Product page can select variations, add to cart, wishlist and open WhatsApp enquiry.
- Ready-stock cart cannot exceed available stock.
- Checkout validates Sri Lankan phone number and address fields.
- COD, bank transfer, store pickup and PayHere routes create correct order/payment states.
- PayHere notify route verifies checksum and does not double-process callbacks.
- Public track order shows status without exposing private customer details.
- Customer can register, log in, manage profile, addresses, wishlist and orders.
- Admin-only `/admin` redirects non-admin users.
- Admin can manage products, categories, tags, shipping, coupons, orders, reviews, banners, settings and custom orders.
- Bank transfer slip submission moves order to payment verification.
- Sitemap, robots, metadata and product structured data render correctly.

## Current Automated Coverage

- Checkout subtotal, delivery, discount and stock validation.
- Admin role permission checks.
- Order insert payload and initial status rules.

Run with:

```bash
npm test
```

## Notes

Demo products and placeholder images are editable sample data. Replace them from the admin dashboard or Supabase Storage before launch.
