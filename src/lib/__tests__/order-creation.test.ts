import { buildOrderInsert, getInitialOrderState } from '../order-creation';
import type { CheckoutInput } from '../validations/checkout';

const checkoutInput: CheckoutInput = {
  first_name: 'Nimal',
  last_name: 'Perera',
  email: 'nimal@example.com',
  phone: '0771234567',
  address_line_1: '12 Galle Road',
  city: 'Colombo',
  district: 'Colombo',
  province: 'Western',
  payment_method: 'bank_transfer',
  shipping_zone_id: '11111111-1111-4111-8111-111111111111',
};

describe('order creation helpers', () => {
  it('sets COD orders as confirmed while other methods wait for payment', () => {
    expect(getInitialOrderState('cod')).toEqual({
      status: 'confirmed',
      payment_status: 'pending',
    });
    expect(getInitialOrderState('payhere')).toEqual({
      status: 'pending_payment',
      payment_status: 'pending',
    });
  });

  it('builds an order insert payload from validated checkout data', () => {
    const payload = buildOrderInsert(checkoutInput, 'MVP-2026-00001', 'user-1', {
      subtotal: 10000,
      discount: 500,
      deliveryCharge: 350,
      total: 9850,
    });

    expect(payload.order_number).toBe('MVP-2026-00001');
    expect(payload.user_id).toBe('user-1');
    expect(payload.shipping_address.city).toBe('Colombo');
    expect(payload.total).toBe(9850);
    expect(payload.status).toBe('pending_payment');
  });
});
