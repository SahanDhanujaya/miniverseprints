/**
 * Email Service Abstraction
 *
 * In development, emails are logged to console.
 * In production, configure an email provider (e.g., Resend, SendGrid, AWS SES)
 * by setting the EMAIL_PROVIDER and related environment variables.
 */

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

type EmailProvider = 'console' | 'resend' | 'sendgrid';

function getProvider(): EmailProvider {
  return (process.env.EMAIL_PROVIDER as EmailProvider) || 'console';
}

async function sendViaConsole(payload: EmailPayload): Promise<boolean> {
  const recipients = Array.isArray(payload.to) ? payload.to.join(', ') : payload.to;
  console.log('─────────────────────────────────────');
  console.log('📧 EMAIL SENT (Console Provider)');
  console.log(`   To: ${recipients}`);
  console.log(`   Subject: ${payload.subject}`);
  console.log(`   Text: ${payload.text || '(HTML only)'}`);
  console.log('─────────────────────────────────────');
  return true;
}

async function sendViaResend(payload: EmailPayload): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error - resend is an optional dependency
    const resendModule = await import('resend').catch(() => null);
    if (!resendModule) {
      console.warn('Resend module not installed. Install with: npm install resend');
      return sendViaConsole(payload);
    }
    const resend = new resendModule.Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'MiniVersePrints <noreply@miniverseprints.lk>',
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    return true;
  } catch (error) {
    console.error('Resend email error:', error);
    return false;
  }
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const provider = getProvider();

  switch (provider) {
    case 'resend':
      return sendViaResend(payload);
    case 'console':
    default:
      return sendViaConsole(payload);
  }
}

// ============================================
// Email Templates
// ============================================

export function registrationEmail(name: string): EmailPayload {
  return {
    to: '',
    subject: 'Welcome to MiniVersePrints!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 32px;">
        <h1 style="color: #E11D48;">Welcome to MiniVersePrints!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for creating an account with MiniVersePrints. We're excited to have you!</p>
        <p>Start exploring our collection of premium 3D-printed figures and collectibles.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/shop" style="display: inline-block; padding: 12px 24px; background: #E11D48; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0;">Shop Now</a>
        <p>Best regards,<br/>The MiniVersePrints Team</p>
      </div>
    `,
    text: `Welcome to MiniVersePrints! Hi ${name}, thank you for creating an account. Start exploring our collection at ${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
  };
}

export function newOrderEmail(orderNumber: string, name: string, total: string): EmailPayload {
  return {
    to: '',
    subject: `Order Confirmed - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 32px;">
        <h1 style="color: #E11D48;">Order Confirmed!</h1>
        <p>Hi ${name},</p>
        <p>Your order <strong>${orderNumber}</strong> has been placed successfully.</p>
        <p>Total: <strong>${total}</strong></p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders" style="display: inline-block; padding: 12px 24px; background: #E11D48; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0;">View Order</a>
        <p>Best regards,<br/>The MiniVersePrints Team</p>
      </div>
    `,
    text: `Order Confirmed! Your order ${orderNumber} has been placed. Total: ${total}. View at ${process.env.NEXT_PUBLIC_SITE_URL}/account/orders`,
  };
}

export function orderStatusEmail(orderNumber: string, name: string, status: string): EmailPayload {
  return {
    to: '',
    subject: `Order Update - ${orderNumber} - ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 32px;">
        <h1 style="color: #E11D48;">Order Update</h1>
        <p>Hi ${name},</p>
        <p>Your order <strong>${orderNumber}</strong> status has been updated to: <strong>${status}</strong></p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders" style="display: inline-block; padding: 12px 24px; background: #E11D48; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0;">Track Order</a>
        <p>Best regards,<br/>The MiniVersePrints Team</p>
      </div>
    `,
    text: `Order Update: Your order ${orderNumber} is now ${status}. Track at ${process.env.NEXT_PUBLIC_SITE_URL}/account/orders`,
  };
}

export function paymentReceivedEmail(orderNumber: string, name: string): EmailPayload {
  return {
    to: '',
    subject: `Payment Received - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 32px;">
        <h1 style="color: #22C55E;">Payment Received</h1>
        <p>Hi ${name},</p>
        <p>We've received your payment for order <strong>${orderNumber}</strong>.</p>
        <p>Your order is now being processed.</p>
        <p>Best regards,<br/>The MiniVersePrints Team</p>
      </div>
    `,
    text: `Payment received for order ${orderNumber}. Your order is now being processed.`,
  };
}

export function dispatchEmail(orderNumber: string, name: string, courier: string, trackingNumber: string, trackingUrl?: string): EmailPayload {
  return {
    to: '',
    subject: `Order Dispatched - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 32px;">
        <h1 style="color: #E11D48;">Order Dispatched!</h1>
        <p>Hi ${name},</p>
        <p>Your order <strong>${orderNumber}</strong> has been dispatched!</p>
        <p>Courier: ${courier}<br/>Tracking: ${trackingNumber}</p>
        ${trackingUrl ? `<a href="${trackingUrl}" style="display: inline-block; padding: 12px 24px; background: #E11D48; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0;">Track Package</a>` : ''}
        <p>Best regards,<br/>The MiniVersePrints Team</p>
      </div>
    `,
    text: `Order ${orderNumber} has been dispatched via ${courier}. Tracking: ${trackingNumber}${trackingUrl ? ` Track at ${trackingUrl}` : ''}`,
  };
}

export function reviewRequestEmail(orderNumber: string, name: string): EmailPayload {
  return {
    to: '',
    subject: 'How was your order? Leave a review!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 32px;">
        <h1 style="color: #E11D48;">How was your order?</h1>
        <p>Hi ${name},</p>
        <p>Your order <strong>${orderNumber}</strong> has been delivered! We'd love to hear your feedback.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders" style="display: inline-block; padding: 12px 24px; background: #E11D48; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0;">Leave a Review</a>
        <p>Best regards,<br/>The MiniVersePrints Team</p>
      </div>
    `,
    text: `Your order ${orderNumber} has been delivered! Leave a review at ${process.env.NEXT_PUBLIC_SITE_URL}/account/orders`,
  };
}

export function passwordResetEmail(name: string, resetUrl: string): EmailPayload {
  return {
    to: '',
    subject: 'Password Reset - MiniVersePrints',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 32px;">
        <h1 style="color: #E11D48;">Password Reset</h1>
        <p>Hi ${name},</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #E11D48; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>Best regards,<br/>The MiniVersePrints Team</p>
      </div>
    `,
    text: `Reset your password at ${resetUrl}. If you didn't request this, ignore this email.`,
  };
}

export function bankPaymentSubmittedEmail(orderNumber: string, name: string): EmailPayload {
  return {
    to: '',
    subject: `Payment Submitted - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 32px;">
        <h1 style="color: #E11D48;">Payment Submitted</h1>
        <p>Hi ${name},</p>
        <p>We've received your bank payment details for order <strong>${orderNumber}</strong>.</p>
        <p>Our team will verify your payment shortly. You'll receive another email once it's confirmed.</p>
        <p>Best regards,<br/>The MiniVersePrints Team</p>
      </div>
    `,
    text: `We've received your bank payment for order ${orderNumber}. We'll verify it shortly.`,
  };
}
