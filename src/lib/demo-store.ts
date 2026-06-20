import type { Category, Product } from '@/types';

export const demoCategories: Category[] = [
  { id: 'cat-00000001', name: 'Action Figures', slug: 'action-figures', description: 'Poseable and display-ready collectible figures', image_url: null, parent_id: null, sort_order: 1, is_active: true, seo_title: null, seo_description: null, created_at: '', updated_at: '' },
  { id: 'cat-00000002', name: 'Minifigures', slug: 'minifigures', description: 'Small collectible figures and desk minis', image_url: null, parent_id: null, sort_order: 2, is_active: true, seo_title: null, seo_description: null, created_at: '', updated_at: '' },
  { id: 'cat-00000003', name: 'Bust Figures', slug: 'bust-figures', description: 'Detailed bust figures and display pieces', image_url: null, parent_id: null, sort_order: 3, is_active: true, seo_title: null, seo_description: null, created_at: '', updated_at: '' },
  { id: 'cat-00000004', name: 'Valentine Gifts', slug: 'valentine-gifts', description: 'Gift-ready custom figures and keepsakes', image_url: null, parent_id: null, sort_order: 4, is_active: true, seo_title: null, seo_description: null, created_at: '', updated_at: '' },
  { id: 'cat-00000005', name: 'Hotwheel Racks', slug: 'hotwheel-racks', description: 'Display racks for Hot Wheels and die-cast cars', image_url: null, parent_id: null, sort_order: 5, is_active: true, seo_title: null, seo_description: null, created_at: '', updated_at: '' },
  { id: 'cat-00000006', name: 'Keychains', slug: 'keychains', description: 'Compact custom keychains and mini accessories', image_url: null, parent_id: null, sort_order: 6, is_active: true, seo_title: null, seo_description: null, created_at: '', updated_at: '' },
  { id: 'cat-00000007', name: 'Controller Holders', slug: 'controller-holders', description: 'Gaming controller stands and display holders', image_url: null, parent_id: null, sort_order: 7, is_active: true, seo_title: null, seo_description: null, created_at: '', updated_at: '' },
];

const productBase = {
  sale_price: null,
  low_stock_threshold: 2,
  production_lead_time_days: null,
  weight_grams: null,
  dimensions: null,
  material: 'PLA',
  is_active: true,
  seo_title: null,
  seo_description: null,
  created_at: '',
  updated_at: '',
} satisfies Partial<Product>;

type DemoProductInput = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  productType?: Product['product_type'];
  stock?: number;
  leadTime?: number | null;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
};

function makeDemoProduct(input: DemoProductInput): Product {
  const productId = `demo-product-${input.id}`;

  return {
    ...productBase,
    id: productId,
    name: input.name,
    slug: input.slug,
    sku: `DEMO-${input.slug.toUpperCase().replace(/[^A-Z0-9]+/g, '-')}`,
    short_description: input.description,
    full_description: `${input.description} Editable sample product for MiniVersePrints.`,
    regular_price: input.price,
    stock_quantity: input.stock ?? 10,
    product_type: input.productType ?? 'ready_stock',
    production_lead_time_days: input.leadTime ?? (input.productType === 'made_to_order' ? 14 : null),
    is_featured: input.featured ?? true,
    is_new_arrival: input.newArrival ?? true,
    is_best_seller: input.bestSeller ?? false,
    images: [{
      id: `demo-img-${input.id}`,
      product_id: productId,
      url: `/images/products/${input.image}`,
      alt_text: input.name,
      sort_order: 0,
      is_main: true,
      created_at: '',
    }],
  } as Product;
}

export const demoProducts: Product[] = [
  makeDemoProduct({ id: 1, name: 'All Might Figure', slug: 'all-might-figure', price: 8700, image: 'allmight.png', description: 'Premium hand-painted 3D-printed hero figure.', stock: 6 }),
  makeDemoProduct({ id: 2, name: 'Itachi Figure', slug: 'itachi-figure', price: 8500, image: 'itachi.png', description: 'Premium hand-painted 3D-printed anime figure.', stock: 0, bestSeller: true }),
  makeDemoProduct({ id: 3, name: 'Customisable Funko Pops', slug: 'customisable-funko-pops', price: 3200, image: 'customisable-funko-pops.png', description: 'Customisable hand-painted mini figure, starting from Rs. 3,200.', productType: 'made_to_order', stock: 0 }),
  makeDemoProduct({ id: 4, name: 'IT Minifigure', slug: 'it-minifigure', price: 3800, image: 'it-minifigure.png', description: 'Hand-painted horror mini figure with display base.', stock: 8, bestSeller: true }),
  makeDemoProduct({ id: 5, name: 'Luffy Bust Figure', slug: 'luffy-bust-figure', price: 3800, image: 'luffy-bust.png', description: 'Hand-painted anime bust figure with detailed display base.', stock: 8, bestSeller: true }),
  makeDemoProduct({ id: 6, name: 'SpiderNoir Funkopop', slug: 'spidernoir-funkopop', price: 1300, image: 'spidernoir-funkopop.png', description: 'Black noir-style mini collectible figure.', stock: 15 }),
  makeDemoProduct({ id: 7, name: 'Mini Figures', slug: 'mini-figures', price: 800, image: 'mini-figures.png', description: 'Small black mini figures, starting from Rs. 800.', stock: 20 }),
  makeDemoProduct({ id: 8, name: 'Superior Spiderman', slug: 'superior-spiderman', price: 9400, image: 'superior-spiderman.png', description: 'Dynamic hand-painted superhero figure with mechanical arms.', stock: 5, bestSeller: true }),
  makeDemoProduct({ id: 9, name: 'Valentine Rose', slug: 'valentine-rose', price: 980, image: 'valentine-rose-v2.png', description: 'Rose-heart decorative gift with display stand.', stock: 12 }),
  makeDemoProduct({ id: 10, name: 'Car Stand', slug: 'car-stand', price: 1200, image: 'car-stand-v2.png', description: '3D-printed display stand for car lovers.', stock: 10 }),
  makeDemoProduct({ id: 11, name: 'Anime Keychains', slug: 'anime-keychains', price: 300, image: 'anime-keychains-v2.png', description: 'Anime-inspired keychains, starting from Rs. 300.', stock: 40 }),
  makeDemoProduct({ id: 12, name: 'Customized Funkos', slug: 'customized-funkos', price: 2500, image: 'customized-funkos-v2.png', description: 'Custom Funko-style collectible made to order.', productType: 'made_to_order', stock: 0 }),
  makeDemoProduct({ id: 13, name: 'MK1 Headset Stand', slug: 'mk1-headset-stand', price: 6800, image: 'mk1-headset-stand-v2.png', description: 'Gaming-themed headset stand with Mortal Kombat styling.', stock: 5, bestSeller: true }),
  makeDemoProduct({ id: 14, name: 'Controller Holder', slug: 'controller-holder', price: 3700, image: 'controller-holder-v2.png', description: 'Painted controller holder for gaming setups.', stock: 6 }),
  makeDemoProduct({ id: 15, name: 'Hotwheel Card Holder', slug: 'hotwheel-card-holder', price: 500, image: 'hotwheel-card-holder-v2.png', description: 'Compact Hot Wheels card display holder.', stock: 30 }),
  makeDemoProduct({ id: 16, name: 'Customized Lithoplane Lamp', slug: 'customized-lithoplane-lamp', price: 3900, image: 'customized-lithoplane-lamp-v2.png', description: 'Custom lithoplane lamp made from your reference image.', productType: 'made_to_order', stock: 0 }),
  makeDemoProduct({ id: 17, name: 'Customized QR Codes', slug: 'customized-qr-codes', price: 400, image: 'customized-qr-codes-v2.png', description: 'Custom 3D-printed QR code signs, Rs. 400 each.', stock: 25 }),
  makeDemoProduct({ id: 18, name: 'Sasuke Figure', slug: 'sasuke-figure', price: 6000, image: 'sasuke-figure.jpeg', description: 'Hand-painted anime action figure.', stock: 4 }),
  makeDemoProduct({ id: 19, name: 'Spiderman Bust', slug: 'spiderman-bust', price: 1200, image: 'spiderman-bust-v3.png', description: 'Compact superhero bust figure.', stock: 10 }),
  makeDemoProduct({ id: 20, name: 'Stich Minifigure', slug: 'stich-minifigure', price: 1200, image: 'stich-minifigure-v3.png', description: 'Cute hand-painted mini figure collectible.', stock: 12 }),
  makeDemoProduct({ id: 21, name: 'Hello Kitty Minifigure', slug: 'hello-kitty-minifigure', price: 1200, image: 'hello-kitty-minifigure-v3.png', description: 'Cute Hello Kitty-style mini figure.', stock: 12 }),
  makeDemoProduct({ id: 22, name: 'Red Hulk Figure', slug: 'red-hulk-figure', price: 6000, image: 'red-hulk-figure-v3.png', description: 'Large hand-painted red action figure.', stock: 4, bestSeller: true }),
  makeDemoProduct({ id: 23, name: 'Safari Elephant', slug: 'safari-elephant', price: 500, image: 'safari-elephant-v3.png', description: 'Minimal safari elephant desk collectible.', stock: 20 }),
  makeDemoProduct({ id: 24, name: "Minato's Kunai", slug: 'minatos-kunai', price: 3200, image: 'minatos-kunai-v2.png', description: 'Anime-inspired kunai prop keychain.', stock: 8 }),
  makeDemoProduct({ id: 25, name: 'Cat Ornament', slug: 'cat-ornament', price: 3800, image: 'cat-ornament-v2.png', description: 'Low-poly cat ornament for shelves and desks.', stock: 8 }),
  makeDemoProduct({ id: 26, name: 'Key Holder Dragon', slug: 'key-holder-dragon', price: 2800, image: 'key-holder-dragon-v2.png', description: 'Dragon-themed wall or desk key holder.', stock: 8 }),
  makeDemoProduct({ id: 27, name: 'Skull Controller Holder', slug: 'skull-controller-holder', price: 4700, image: 'skull-controller-holder-v2.png', description: 'Skull-shaped controller holder for gaming setups.', stock: 6, bestSeller: true }),
  makeDemoProduct({ id: 28, name: 'Oni Mask Controller Holder', slug: 'oni-mask-controller-holder', price: 4600, image: 'oni-mask-controller-holder-v3.png', description: 'Oni mask controller holder with painted finish.', stock: 6 }),
  makeDemoProduct({ id: 29, name: 'Dummy Action Figure', slug: 'dummy-action-figure', price: 1200, image: 'dummy-action-figure-v2.png', description: 'Poseable dummy action figure for display or reference.', stock: 12 }),
  makeDemoProduct({ id: 30, name: 'Custom Pet Tags', slug: 'custom-pet-tags', price: 300, image: 'custom-pet-tags.png', description: 'Custom paw-shaped pet tags with name and phone number.', stock: 25 }),
  makeDemoProduct({ id: 31, name: 'Number Plate Keychains', slug: 'number-plate-keychains', price: 300, image: 'number-plate-keychains.png', description: 'Custom vehicle number plate keychains.', stock: 30 }),
];

const productCategorySlugs: Record<string, string[]> = {
  'action-figures': ['all-might-figure', 'itachi-figure', 'superior-spiderman', 'sasuke-figure', 'red-hulk-figure', 'dummy-action-figure'],
  minifigures: ['customisable-funko-pops', 'it-minifigure', 'spidernoir-funkopop', 'mini-figures', 'customized-funkos', 'stich-minifigure', 'hello-kitty-minifigure', 'safari-elephant'],
  'bust-figures': ['luffy-bust-figure', 'spiderman-bust'],
  'valentine-gifts': ['customisable-funko-pops', 'valentine-rose', 'customized-funkos', 'customized-lithoplane-lamp', 'cat-ornament'],
  'hotwheel-racks': ['hotwheel-card-holder', 'car-stand'],
  keychains: ['anime-keychains', 'customized-qr-codes', 'minatos-kunai', 'key-holder-dragon', 'custom-pet-tags', 'number-plate-keychains'],
  'controller-holders': ['mk1-headset-stand', 'controller-holder', 'skull-controller-holder', 'oni-mask-controller-holder'],
};

export function getDemoCategoryBySlug(slug: string) {
  return demoCategories.find((category) => category.slug === slug) || null;
}

export function getDemoProductsByCategorySlug(slug: string) {
  const slugs = new Set(productCategorySlugs[slug] || []);
  return demoProducts.filter((product) => slugs.has(product.slug));
}

export function getDemoProductsByCategoryId(categoryId: string) {
  const category = demoCategories.find((item) => item.id === categoryId);
  return category ? getDemoProductsByCategorySlug(category.slug) : demoProducts;
}
