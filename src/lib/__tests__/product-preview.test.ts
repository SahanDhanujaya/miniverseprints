import { resolveProductModelUrl, hasProductPreview } from '@/lib/product-preview';

describe('product preview resolution', () => {
  it('prefers an uploaded model url when present', () => {
    const result = resolveProductModelUrl({
      model_url: 'https://cdn.example.com/models/box.glb',
      attributes: [{ name: 'model_url', value: 'https://cdn.example.com/legacy.glb' }],
    } as any);

    expect(result).toBe('https://cdn.example.com/models/box.glb');
    expect(hasProductPreview({ model_url: 'https://cdn.example.com/models/box.glb' } as any)).toBe(true);
  });

  it('returns null when no preview exists', () => {
    expect(resolveProductModelUrl({} as any)).toBeNull();
    expect(hasProductPreview({} as any)).toBe(false);
  });
});
