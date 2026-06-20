import {
  calculateCheckoutTotals,
  validateReadyStock,
  type PricingCartItem,
} from '../checkout-calculations';

const readyItem: PricingCartItem = {
  quantity: 2,
  product: {
    name: 'Red Titan Figure',
    regular_price: 5000,
    sale_price: 4500,
    product_type: 'ready_stock',
    stock_quantity: 4,
  },
};

describe('checkout calculations', () => {
  it('recalculates subtotal, delivery and total on the server rules', () => {
    const totals = calculateCheckoutTotals([readyItem], {
      rate_type: 'flat',
      base_rate: 500,
      free_delivery_threshold: null,
    });

    expect(totals).toEqual({
      subtotal: 9000,
      discount: 0,
      deliveryCharge: 500,
      total: 9500,
    });
  });

  it('applies free delivery thresholds and percentage coupons', () => {
    const totals = calculateCheckoutTotals(
      [readyItem],
      { rate_type: 'flat', base_rate: 500, free_delivery_threshold: 8000 },
      { type: 'percentage', value: 10 }
    );

    expect(totals.deliveryCharge).toBe(0);
    expect(totals.discount).toBe(900);
    expect(totals.total).toBe(8100);
  });

  it('prevents ready-stock orders above available stock', () => {
    expect(validateReadyStock([{ ...readyItem, quantity: 5 }])).toBe(
      'Red Titan Figure has only 4 items available'
    );
  });
});
