import { CURRENCY_SYMBOL } from './constants';

/**
 * Format price in LKR
 */
export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL} ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format price without decimals for whole numbers
 */
export function formatPriceCompact(amount: number): string {
  if (amount % 1 === 0) {
    return `${CURRENCY_SYMBOL} ${amount.toLocaleString('en-LK')}`;
  }
  return formatPrice(amount);
}

/**
 * Generate a URL-friendly slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Generate order number: MVP-YYYY-NNNNN
 */
export function generateOrderNumber(sequence: number): string {
  const year = new Date().getFullYear();
  const seq = String(sequence).padStart(5, '0');
  return `MVP-${year}-${seq}`;
}

/**
 * Get WhatsApp link with pre-filled message
 */
export function getWhatsAppLink(message: string): string {
  return `https://wa.me/94782525156?text=${encodeURIComponent(message)}`;
}

/**
 * Get product WhatsApp enquiry link
 */
export function getProductEnquiryLink(productName: string, productUrl: string): string {
  const message = `Hi! I'm interested in the ${productName}. ${productUrl}`;
  return getWhatsAppLink(message);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * Sanitize HTML content (basic)
 */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

/**
 * Calculate effective price (sale price if available, otherwise regular)
 */
export function getEffectivePrice(regularPrice: number, salePrice: number | null): number {
  return salePrice && salePrice < regularPrice ? salePrice : regularPrice;
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(regularPrice: number, salePrice: number | null): number {
  if (!salePrice || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

/**
 * Calculate variation price
 */
export function getVariationPrice(basePrice: number, adjustment: number): number {
  return Math.max(0, basePrice + adjustment);
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Validate Sri Lankan mobile number
 */
export function isValidSriLankanMobile(phone: string): boolean {
  return /^(?:\+94|0)7[0-9]{8}$/.test(phone.replace(/\s/g, ''));
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Build breadcrumbs from path segments
 */
export function buildBreadcrumbs(segments: { label: string; href: string }[]) {
  return [{ label: 'Home', href: '/' }, ...segments];
}

/**
 * Get order status label
 */
export function getOrderStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    pending_payment: 'Pending Payment',
    payment_verification: 'Payment Verification',
    confirmed: 'Confirmed',
    printing: 'Printing',
    post_processing: 'Post Processing',
    painting: 'Painting',
    quality_checking: 'Quality Checking',
    ready_for_dispatch: 'Ready for Dispatch',
    dispatched: 'Dispatched',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return statusMap[status] || status;
}

/**
 * Class name utility (like clsx)
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
