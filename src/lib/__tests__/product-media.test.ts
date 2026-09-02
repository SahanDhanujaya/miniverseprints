import { extractUploadedImageUrls, pickPrimaryImageUrl } from '@/lib/product-media';

describe('product media persistence', () => {
  it('extracts uploaded image urls from hidden form inputs', () => {
    const formData = new FormData();
    formData.append('image_url', 'https://example.com/products/1.jpg');
    formData.append('image_url', 'https://example.com/products/2.jpg');

    expect(extractUploadedImageUrls(formData)).toEqual([
      'https://example.com/products/1.jpg',
      'https://example.com/products/2.jpg',
    ]);

    expect(pickPrimaryImageUrl(formData)).toBe('https://example.com/products/1.jpg');
  });

  it('ignores empty or whitespace values', () => {
    const formData = new FormData();
    formData.append('image_url', '   ');
    formData.append('image_url', 'https://example.com/products/3.jpg');

    expect(extractUploadedImageUrls(formData)).toEqual(['https://example.com/products/3.jpg']);
    expect(pickPrimaryImageUrl(formData)).toBe('https://example.com/products/3.jpg');
  });
});
