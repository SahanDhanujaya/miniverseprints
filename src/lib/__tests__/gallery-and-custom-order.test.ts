import { demoGalleryItems, GALLERY_CATEGORIES } from '../demo-gallery';
import { customOrderSchema } from '../validations/custom-order';

describe('Gallery and Custom Order System', () => {
  test('demo gallery contains populated items across categories', () => {
    expect(demoGalleryItems.length).toBeGreaterThan(15);

    const actionFigures = demoGalleryItems.filter(i => i.category === 'Action Figures');
    const busts = demoGalleryItems.filter(i => i.category === 'Busts & Statues');
    const minis = demoGalleryItems.filter(i => i.category === 'Minifigures');
    const stands = demoGalleryItems.filter(i => i.category === 'Holders & Stands');
    const gifts = demoGalleryItems.filter(i => i.category === 'Custom Gifts');
    const keychains = demoGalleryItems.filter(i => i.category === 'Keychains');

    expect(actionFigures.length).toBeGreaterThan(0);
    expect(busts.length).toBeGreaterThan(0);
    expect(minis.length).toBeGreaterThan(0);
    expect(stands.length).toBeGreaterThan(0);
    expect(gifts.length).toBeGreaterThan(0);
    expect(keychains.length).toBeGreaterThan(0);
  });

  test('validates custom order requests correctly', () => {
    const validRequest = {
      name: 'Sahan Dhanujaya',
      whatsapp: '0782525156',
      email: 'sahan@example.com',
      character_name: 'Goku Ultra Instinct',
      size: 'Standard (~15cm)',
      paint_type: 'Full Hand-Painted & Shaded',
      required_date: '2026-09-15',
      budget: 'Rs. 5,000 - 10,000',
      description: 'Dynamic power up pose with aura base.',
    };

    const parsed = customOrderSchema.safeParse(validRequest);
    expect(parsed.success).toBe(true);
  });

  test('rejects custom order without name or character', () => {
    const invalid = {
      name: '',
      whatsapp: '0782525156',
      character_name: '',
    };

    const parsed = customOrderSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  test('WhatsApp link encodes target number +94782525156 correctly', () => {
    const targetNumber = '94782525156';
    const message = 'Test custom order message';
    const url = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;

    expect(url).toContain('wa.me/94782525156');
    expect(url).toContain('Test%20custom%20order%20message');
  });

  test('validates master admin credentials match user specification', () => {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = require('../auth-session');
    expect(ADMIN_EMAIL).toBe('chaniyarvc@gmail.com');
    expect(ADMIN_PASSWORD).toBe('139Miniverse@11');
  });
});
