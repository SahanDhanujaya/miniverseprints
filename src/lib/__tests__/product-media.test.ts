import { extractUploadedImageUrls, pickPrimaryImageUrl, resolveImageUrlInput } from '@/lib/product-media';

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

  it('keeps the image field undefined when it is absent from the form payload', () => {
    const formData = new FormData();

    expect(resolveImageUrlInput(formData)).toBeUndefined();
    expect(pickPrimaryImageUrl(formData)).toBeNull();
  });

  it('treats an explicitly empty image field as an intentional clear and not as a missing field', () => {
    const formData = new FormData();
    formData.append('image_url', '   ');

    expect(resolveImageUrlInput(formData)).toBeNull();
  });
});
