export type ShippingPolicy = {
  base_rate: number;
  per_kg_rate: number | null;
  free_delivery_threshold: number | null;
  estimated_days_min: number;
  estimated_days_max: number;
  rate_type: 'flat';
};

export function getShippingPolicy(zoneName: string): ShippingPolicy {
  const isOtherProvince = /other|sri Lankan districts/i.test(zoneName);

  return {
    base_rate: isOtherProvince ? 500 : 450,
    per_kg_rate: null,
    free_delivery_threshold: null,
    estimated_days_min: 3,
    estimated_days_max: 5,
    rate_type: 'flat',
  };
}

export function isStorePickupZone(zoneName: string) {
  return /store pickup/i.test(zoneName);
}
