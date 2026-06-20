-- MiniVersePrints Seed Data
-- Run after migrations in Supabase SQL Editor

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Action Figures', 'action-figures', 'Poseable and display-ready collectible figures', 1, true),
  ('10000000-0000-0000-0000-000000000002', 'Minifigures', 'minifigures', 'Small collectible figures and desk minis', 2, true),
  ('10000000-0000-0000-0000-000000000003', 'Bust Figures', 'bust-figures', 'Detailed bust figures and display pieces', 3, true),
  ('10000000-0000-0000-0000-000000000004', 'Valentine Gifts', 'valentine-gifts', 'Gift-ready custom figures and keepsakes', 4, true),
  ('10000000-0000-0000-0000-000000000005', 'Hotwheel Racks', 'hotwheel-racks', 'Display racks for Hot Wheels and die-cast cars', 5, true),
  ('10000000-0000-0000-0000-000000000006', 'Keychains', 'keychains', 'Compact custom keychains and mini accessories', 6, true),
  ('10000000-0000-0000-0000-000000000007', 'Controller Holders', 'controller-holders', 'Gaming controller stands and display holders', 7, true);

-- ============================================
-- TAGS
-- ============================================
INSERT INTO public.tags (id, name, slug) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Anime', 'anime'),
  ('20000000-0000-0000-0000-000000000002', 'Superhero', 'superhero'),
  ('20000000-0000-0000-0000-000000000003', 'Gaming', 'gaming'),
  ('20000000-0000-0000-0000-000000000004', 'Horror', 'horror'),
  ('20000000-0000-0000-0000-000000000005', 'Bust', 'bust'),
  ('20000000-0000-0000-0000-000000000006', 'Mini', 'mini'),
  ('20000000-0000-0000-0000-000000000007', 'Desk', 'desk'),
  ('20000000-0000-0000-0000-000000000008', 'Custom', 'custom'),
  ('20000000-0000-0000-0000-000000000009', 'Painted', 'painted'),
  ('20000000-0000-0000-0000-000000000010', 'Unpainted', 'unpainted'),
  ('20000000-0000-0000-0000-000000000011', 'Best Seller', 'best-seller'),
  ('20000000-0000-0000-0000-000000000012', 'New', 'new');

-- ============================================
-- PRODUCTS (12+ demo products)
-- ============================================
INSERT INTO public.products (id, name, slug, sku, short_description, full_description, regular_price, sale_price, stock_quantity, low_stock_threshold, product_type, production_lead_time_days, weight_grams, material, is_featured, is_new_arrival, is_best_seller, is_active) VALUES
  ('30000000-0000-0000-0000-000000000001', 'All Might Figure', 'all-might-figure', 'MVP-ANM-001',
   'Premium hand-painted 3D-printed hero figure.',
   'Premium hand-painted All Might figure with bold colours, durable material, and display-ready finish. This seeded sample uses the provided MiniVersePrints product poster and can be edited from the admin dashboard.',
   8700.00, NULL, 25, 5, 'ready_stock', NULL, 350, 'PLA+', true, true, true, true),

  ('30000000-0000-0000-0000-000000000002', 'Itachi Figure', 'itachi-figure', 'MVP-ANM-002',
   'Premium hand-painted 3D-printed anime figure.',
   'Premium hand-painted Itachi figure with detailed cloak styling, durable material, and display-ready finish. This seeded sample uses the provided MiniVersePrints product poster and can be edited from the admin dashboard.',
   8500.00, NULL, 15, 5, 'ready_stock', NULL, 280, 'PLA+', true, true, true, true),

  ('30000000-0000-0000-0000-000000000003', 'Customisable Funko Pops', 'customisable-funko-pops', 'MVP-FNK-001',
   'Customisable hand-painted mini figure, starting from Rs. 3,200.',
   'Customisable Funko Pops with hand-painted details and a made-to-order finish. This seeded sample uses the provided MiniVersePrints product poster and can be edited from the admin dashboard.',
   3200.00, NULL, 0, 0, 'made_to_order', 14, 150, 'PLA+', true, true, false, true),

  ('30000000-0000-0000-0000-000000000004', 'IT Minifigure', 'it-minifigure', 'MVP-HRR-001',
   'Hand-painted horror mini figure with display base.',
   'IT Minifigure with painted details, red balloon styling, and display-ready finish. This seeded sample uses the provided MiniVersePrints product poster and can be edited from the admin dashboard.',
   3800.00, NULL, 30, 5, 'ready_stock', NULL, 120, 'PLA+', true, true, true, true),

  ('30000000-0000-0000-0000-000000000005', 'Luffy Bust Figure', 'luffy-bust-figure', 'MVP-BST-001',
   'Hand-painted anime bust figure with detailed display base.',
   'Luffy Bust Figure with hand-painted detail and display-ready bust base. This seeded sample uses the provided MiniVersePrints product poster and can be edited from the admin dashboard.',
   3800.00, NULL, 10, 3, 'ready_stock', NULL, 300, 'PLA+', true, true, true, true),

  ('30000000-0000-0000-0000-000000000006', 'SpiderNoir Funkopop', 'spidernoir-funkopop', 'MVP-FNK-002',
   'Black noir-style mini collectible figure.',
   'SpiderNoir Funkopop with black noir styling and compact collectible scale. This seeded sample uses the provided MiniVersePrints product poster and can be edited from the admin dashboard.',
   1300.00, NULL, 18, 5, 'ready_stock', NULL, 100, 'PLA+', true, true, false, true),

  ('30000000-0000-0000-0000-000000000007', 'Mini Figures', 'mini-figures', 'MVP-MNI-001',
   'Small black mini figures, starting from Rs. 800.',
   'Mini Figures collection with small-scale display pieces for shelves and desks. This seeded sample uses the provided MiniVersePrints product poster and can be edited from the admin dashboard.',
   800.00, NULL, 30, 5, 'ready_stock', NULL, 80, 'PLA+', true, true, false, true),

  ('30000000-0000-0000-0000-000000000008', 'Custom Funko-Style Figure', 'custom-funko-style-figure', 'MVP-FNK-003',
   'A personalised Funko-style figure - customise to look like anyone!',
   'Want a figure that looks just like you, a friend, or a loved one? Our Custom Funko-Style Figure lets you personalise every detail - hair, outfit, accessories, and pose. Just send us reference photos and we''ll create a one-of-a-kind collectible that''s uniquely yours.',
   5000.00, NULL, 0, 0, 'made_to_order', 14, 150, 'PLA+', true, true, false, true),

  ('30000000-0000-0000-0000-000000000009', 'Galactic Warrior Figure', 'galactic-warrior-figure', 'MVP-GAM-001',
   'An interstellar warrior figure armed with plasma blade and shield.',
   'The Galactic Warrior figure brings your favourite sci-fi gaming character to life. Armed with a glowing plasma blade and energy shield, this figure stands ready to defend the galaxy. Perfect for gaming enthusiasts and sci-fi collectors alike.',
   9000.00, NULL, 12, 3, 'ready_stock', NULL, 380, 'PLA+', false, false, false, true),

  ('30000000-0000-0000-0000-000000000010', 'Crystal Dragon Desk Decoration', 'crystal-dragon-desk-decoration', 'MVP-DSK-001',
   'An elegant crystal dragon perched atop a rocky spire for your desk.',
   'This stunning Crystal Dragon desk decoration features a majestic dragon perched atop a crystalline rock formation. The intricate wing details and crystalline texture make it an eye-catching addition to any workspace. Available in multiple colours.',
   4500.00, NULL, 22, 5, 'ready_stock', NULL, 200, 'PLA+', true, true, false, true),

  ('30000000-0000-0000-0000-000000000011', 'Pixel Sword Keychain Mini', 'pixel-sword-keychain-mini', 'MVP-MNI-002',
   'A retro pixel-art style sword keychain mini figure.',
   'The Pixel Sword mini figure combines retro gaming aesthetics with modern 3D printing. This charming pixel-art sword makes a perfect keychain or desk ornament for gamers who appreciate the classics. Small but full of character.',
   1500.00, NULL, 50, 10, 'ready_stock', NULL, 40, 'PLA+', false, false, false, true),

  ('30000000-0000-0000-0000-000000000012', 'Mystic Sorceress Figure', 'mystic-sorceress-figure', 'MVP-ANM-004',
   'An enchanting sorceress figure casting a powerful spell.',
   'The Mystic Sorceress figure captures the moment of spellcasting with incredible detail. From the flowing robes and arcane symbols to the magical energy effects at her fingertips, this figure is a stunning display of fantasy artistry brought to life through 3D printing.',
   9500.00, 8500.00, 14, 5, 'ready_stock', NULL, 340, 'PLA+', false, true, false, true),

  ('30000000-0000-0000-0000-000000000013', 'Superior Spiderman', 'superior-spiderman', 'MVP-SHR-003',
   'Dynamic hand-painted superhero figure with mechanical arms.',
   'Superior Spiderman figure with dramatic pose, mechanical arms, and warm MiniVersePrints poster artwork. This seeded sample uses the generated product poster and can be edited from the admin dashboard.',
   9400.00, NULL, 5, 2, 'ready_stock', NULL, 360, 'PLA+', true, true, true, true);

INSERT INTO public.products (id, name, slug, sku, short_description, full_description, regular_price, sale_price, stock_quantity, low_stock_threshold, product_type, production_lead_time_days, weight_grams, material, is_featured, is_new_arrival, is_best_seller, is_active) VALUES
  ('30000000-0000-0000-0000-000000000014', 'Valentine Rose', 'valentine-rose', 'MVP-GFT-001', 'Rose-heart decorative gift with display stand.', 'Rose-heart decorative gift with display stand. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 980.00, NULL, 12, 2, 'ready_stock', NULL, 100, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000015', 'Car Stand', 'car-stand', 'MVP-HWR-001', '3D-printed display stand for car lovers.', '3D-printed display stand for car lovers. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 1200.00, NULL, 10, 2, 'ready_stock', NULL, 180, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000016', 'Anime Keychains', 'anime-keychains', 'MVP-KCH-001', 'Anime-inspired keychains, starting from Rs. 300.', 'Anime-inspired keychains, starting from Rs. 300. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 300.00, NULL, 40, 10, 'ready_stock', NULL, 30, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000017', 'Customized Funkos', 'customized-funkos', 'MVP-FNK-004', 'Custom Funko-style collectible made to order.', 'Custom Funko-style collectible made to order. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 2500.00, NULL, 0, 0, 'made_to_order', 14, 150, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000018', 'MK1 Headset Stand', 'mk1-headset-stand', 'MVP-GAM-002', 'Gaming-themed headset stand with Mortal Kombat styling.', 'Gaming-themed headset stand with Mortal Kombat styling. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 6800.00, NULL, 5, 2, 'ready_stock', NULL, 300, 'PLA+', true, true, true, true),
  ('30000000-0000-0000-0000-000000000019', 'Controller Holder', 'controller-holder', 'MVP-CTR-001', 'Painted controller holder for gaming setups.', 'Painted controller holder for gaming setups. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 3700.00, NULL, 6, 2, 'ready_stock', NULL, 230, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000020', 'Hotwheel Card Holder', 'hotwheel-card-holder', 'MVP-HWR-002', 'Compact Hot Wheels card display holder.', 'Compact Hot Wheels card display holder. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 500.00, NULL, 30, 5, 'ready_stock', NULL, 60, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000021', 'Customized Lithoplane Lamp', 'customized-lithoplane-lamp', 'MVP-GFT-002', 'Custom lithoplane lamp made from your reference image.', 'Custom lithoplane lamp made from your reference image. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 3900.00, NULL, 0, 0, 'made_to_order', 14, 260, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000022', 'Customized QR Codes', 'customized-qr-codes', 'MVP-KCH-002', 'Custom 3D-printed QR code signs, Rs. 400 each.', 'Custom 3D-printed QR code signs, Rs. 400 each. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 400.00, NULL, 25, 5, 'ready_stock', NULL, 45, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000023', 'Sasuke Figure', 'sasuke-figure', 'MVP-ANM-005', 'Hand-painted anime action figure.', 'Hand-painted anime action figure. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 6000.00, NULL, 4, 2, 'ready_stock', NULL, 280, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000024', 'Spiderman Bust', 'spiderman-bust', 'MVP-BST-002', 'Compact superhero bust figure.', 'Compact superhero bust figure. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 1200.00, NULL, 10, 2, 'ready_stock', NULL, 120, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000025', 'Stich Minifigure', 'stich-minifigure', 'MVP-MNI-003', 'Cute hand-painted mini figure collectible.', 'Cute hand-painted mini figure collectible. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 1200.00, NULL, 12, 2, 'ready_stock', NULL, 90, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000026', 'Hello Kitty Minifigure', 'hello-kitty-minifigure', 'MVP-MNI-004', 'Cute Hello Kitty-style mini figure.', 'Cute Hello Kitty-style mini figure. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 1200.00, NULL, 12, 2, 'ready_stock', NULL, 90, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000027', 'Red Hulk Figure', 'red-hulk-figure', 'MVP-SHR-004', 'Large hand-painted red action figure.', 'Large hand-painted red action figure. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 6000.00, NULL, 4, 2, 'ready_stock', NULL, 420, 'PLA+', true, true, true, true),
  ('30000000-0000-0000-0000-000000000028', 'Safari Elephant', 'safari-elephant', 'MVP-MNI-005', 'Minimal safari elephant desk collectible.', 'Minimal safari elephant desk collectible. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 500.00, NULL, 20, 5, 'ready_stock', NULL, 70, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000029', 'Minato''s Kunai', 'minatos-kunai', 'MVP-KCH-003', 'Anime-inspired kunai prop keychain.', 'Anime-inspired kunai prop keychain. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 3200.00, NULL, 8, 2, 'ready_stock', NULL, 120, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000030', 'Cat Ornament', 'cat-ornament', 'MVP-GFT-003', 'Low-poly cat ornament for shelves and desks.', 'Low-poly cat ornament for shelves and desks. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 3800.00, NULL, 8, 2, 'ready_stock', NULL, 130, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000031', 'Key Holder Dragon', 'key-holder-dragon', 'MVP-KCH-004', 'Dragon-themed wall or desk key holder.', 'Dragon-themed wall or desk key holder. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 2800.00, NULL, 8, 2, 'ready_stock', NULL, 180, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000032', 'Skull Controller Holder', 'skull-controller-holder', 'MVP-CTR-002', 'Skull-shaped controller holder for gaming setups.', 'Skull-shaped controller holder for gaming setups. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 4700.00, NULL, 6, 2, 'ready_stock', NULL, 260, 'PLA+', true, true, true, true),
  ('30000000-0000-0000-0000-000000000033', 'Oni Mask Controller Holder', 'oni-mask-controller-holder', 'MVP-CTR-003', 'Oni mask controller holder with painted finish.', 'Oni mask controller holder with painted finish. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 4600.00, NULL, 6, 2, 'ready_stock', NULL, 260, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000034', 'Dummy Action Figure', 'dummy-action-figure', 'MVP-ACT-001', 'Poseable dummy action figure for display or reference.', 'Poseable dummy action figure for display or reference. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 1200.00, NULL, 12, 2, 'ready_stock', NULL, 80, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000035', 'Custom Pet Tags', 'custom-pet-tags', 'MVP-PET-001', 'Custom paw-shaped pet tags with name and phone number.', 'Custom paw-shaped pet tags with name and phone number. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 300.00, NULL, 25, 5, 'ready_stock', NULL, 25, 'PLA+', true, true, false, true),
  ('30000000-0000-0000-0000-000000000036', 'Number Plate Keychains', 'number-plate-keychains', 'MVP-KCH-005', 'Custom vehicle number plate keychains.', 'Custom vehicle number plate keychains made to order from your vehicle number. This seeded sample uses a MiniVersePrints themed product poster and can be edited from the admin dashboard.', 300.00, NULL, 30, 5, 'ready_stock', NULL, 25, 'PLA+', true, true, false, true);

-- ============================================
-- PRODUCT CATEGORIES (assign products to categories)
-- ============================================
INSERT INTO public.product_categories (product_id, category_id) VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001'), -- All Might -> Action Figures
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001'), -- Itachi -> Action Figures
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002'), -- Customisable Funko Pops -> Minifigures
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004'), -- Customisable Funko Pops -> Valentine Gifts
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002'), -- IT Minifigure -> Minifigures
  ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003'), -- Luffy Bust Figure -> Bust Figures
  ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002'), -- SpiderNoir Funkopop -> Minifigures
  ('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002'), -- Mini Figures -> Minifigures
  ('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002'), -- Custom Funko -> Minifigures
  ('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004'), -- Custom Funko -> Valentine Gifts
  ('30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001'), -- Galactic Warrior -> Action Figures
  ('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000004'), -- Crystal Dragon -> Valentine Gifts
  ('30000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000006'), -- Pixel Sword -> Keychains
  ('30000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001'), -- Mystic Sorceress -> Action Figures
  ('30000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001'); -- Superior Spiderman -> Action Figures

INSERT INTO public.product_categories (product_id, category_id) VALUES
  ('30000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000004'),
  ('30000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000005'),
  ('30000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000006'),
  ('30000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000004'),
  ('30000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000007'),
  ('30000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000007'),
  ('30000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000005'),
  ('30000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000004'),
  ('30000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000006'),
  ('30000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000003'),
  ('30000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000026', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000027', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000028', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000029', '10000000-0000-0000-0000-000000000006'),
  ('30000000-0000-0000-0000-000000000030', '10000000-0000-0000-0000-000000000004'),
  ('30000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000006'),
  ('30000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000007'),
  ('30000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000007'),
  ('30000000-0000-0000-0000-000000000034', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000035', '10000000-0000-0000-0000-000000000006'),
  ('30000000-0000-0000-0000-000000000036', '10000000-0000-0000-0000-000000000006');

-- ============================================
-- PRODUCT TAGS
-- ============================================
INSERT INTO public.product_tags (product_id, tag_id) VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'), ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009'), ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000011'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001'), ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000011'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005'), ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000009'),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004'), ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000005'), ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011'),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001'), ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000012'),
  ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002'), ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000011'),
  ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000004'), ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000006'), ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000012'),
  ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000008'), ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000012'),
  ('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000003'),
  ('30000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000007'), ('30000000-0000-0000-0000-000000000010', '20000000-0000-0000-0000-000000000012'),
  ('30000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000003'), ('30000000-0000-0000-0000-000000000011', '20000000-0000-0000-0000-000000000006'),
  ('30000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000001'), ('30000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000012'),
  ('30000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000002'), ('30000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000009'), ('30000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000011'), ('30000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000012');

-- ============================================
-- PRODUCT IMAGES (placeholder)
-- ============================================
INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_main) VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '/images/products/allmight.png', 'All Might Figure', 0, true),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '/images/products/itachi.png', 'Itachi Figure', 0, true),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '/images/products/customisable-funko-pops.png', 'Customisable Funko Pops', 0, true),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', '/images/products/it-minifigure.png', 'IT Minifigure', 0, true),
  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', '/images/products/luffy-bust.png', 'Luffy Bust Figure', 0, true),
  ('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000006', '/images/products/spidernoir-funkopop.png', 'SpiderNoir Funkopop', 0, true),
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000007', '/images/products/mini-figures.png', 'Mini Figures', 0, true),
  ('40000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000008', '/images/products/custom-funko-style.svg', 'Custom Funko-Style Figure', 0, true),
  ('40000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000009', '/images/products/galactic-warrior.svg', 'Galactic Warrior Figure', 0, true),
  ('40000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000010', '/images/products/crystal-dragon-desk.svg', 'Crystal Dragon Desk Decoration', 0, true),
  ('40000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000011', '/images/products/pixel-sword-keychain.svg', 'Pixel Sword Keychain Mini', 0, true),
  ('40000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000012', '/images/products/mystic-sorceress.svg', 'Mystic Sorceress Figure', 0, true),
  ('40000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000013', '/images/products/superior-spiderman.png', 'Superior Spiderman', 0, true);

INSERT INTO public.product_images (id, product_id, url, alt_text, sort_order, is_main) VALUES
  ('40000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000014', '/images/products/valentine-rose-v2.png', 'Valentine Rose', 0, true),
  ('40000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000015', '/images/products/car-stand-v2.png', 'Car Stand', 0, true),
  ('40000000-0000-0000-0000-000000000016', '30000000-0000-0000-0000-000000000016', '/images/products/anime-keychains-v2.png', 'Anime Keychains', 0, true),
  ('40000000-0000-0000-0000-000000000017', '30000000-0000-0000-0000-000000000017', '/images/products/customized-funkos-v2.png', 'Customized Funkos', 0, true),
  ('40000000-0000-0000-0000-000000000018', '30000000-0000-0000-0000-000000000018', '/images/products/mk1-headset-stand-v2.png', 'MK1 Headset Stand', 0, true),
  ('40000000-0000-0000-0000-000000000019', '30000000-0000-0000-0000-000000000019', '/images/products/controller-holder-v2.png', 'Controller Holder', 0, true),
  ('40000000-0000-0000-0000-000000000020', '30000000-0000-0000-0000-000000000020', '/images/products/hotwheel-card-holder-v2.png', 'Hotwheel Card Holder', 0, true),
  ('40000000-0000-0000-0000-000000000021', '30000000-0000-0000-0000-000000000021', '/images/products/customized-lithoplane-lamp-v2.png', 'Customized Lithoplane Lamp', 0, true),
  ('40000000-0000-0000-0000-000000000022', '30000000-0000-0000-0000-000000000022', '/images/products/customized-qr-codes-v2.png', 'Customized QR Codes', 0, true),
  ('40000000-0000-0000-0000-000000000023', '30000000-0000-0000-0000-000000000023', '/images/products/sasuke-figure.jpeg', 'Sasuke Figure', 0, true),
  ('40000000-0000-0000-0000-000000000024', '30000000-0000-0000-0000-000000000024', '/images/products/spiderman-bust.jpeg', 'Spiderman Bust', 0, true),
  ('40000000-0000-0000-0000-000000000025', '30000000-0000-0000-0000-000000000025', '/images/products/stitch-mini-figure.jpeg', 'Stich Minifigure', 0, true),
  ('40000000-0000-0000-0000-000000000026', '30000000-0000-0000-0000-000000000026', '/images/products/hello-kitty.jpeg', 'Hello Kitty Minifigure', 0, true),
  ('40000000-0000-0000-0000-000000000027', '30000000-0000-0000-0000-000000000027', '/images/products/red-hulk.jpeg', 'Red Hulk Figure', 0, true),
  ('40000000-0000-0000-0000-000000000028', '30000000-0000-0000-0000-000000000028', '/images/products/safari-elephant.jpeg', 'Safari Elephant', 0, true),
  ('40000000-0000-0000-0000-000000000029', '30000000-0000-0000-0000-000000000029', '/images/products/minatos-kunai-v2.png', 'Minato''s Kunai', 0, true),
  ('40000000-0000-0000-0000-000000000030', '30000000-0000-0000-0000-000000000030', '/images/products/cat-ornament-v2.png', 'Cat Ornament', 0, true),
  ('40000000-0000-0000-0000-000000000031', '30000000-0000-0000-0000-000000000031', '/images/products/key-holder-dragon-v2.png', 'Key Holder Dragon', 0, true),
  ('40000000-0000-0000-0000-000000000032', '30000000-0000-0000-0000-000000000032', '/images/products/skull-controller-holder-v2.png', 'Skull Controller Holder', 0, true),
  ('40000000-0000-0000-0000-000000000033', '30000000-0000-0000-0000-000000000033', '/images/products/onimask-controller.jpeg', 'Oni Mask Controller Holder', 0, true),
  ('40000000-0000-0000-0000-000000000034', '30000000-0000-0000-0000-000000000034', '/images/products/dummy-action-figure-v2.png', 'Dummy Action Figure', 0, true),
  ('40000000-0000-0000-0000-000000000035', '30000000-0000-0000-0000-000000000035', '/images/products/custom-pet-tags.png', 'Custom Pet Tags', 0, true),
  ('40000000-0000-0000-0000-000000000036', '30000000-0000-0000-0000-000000000036', '/images/products/number-plate-keychains.png', 'Number Plate Keychains', 0, true);

-- ============================================
-- PRODUCT VARIATIONS
-- ============================================
INSERT INTO public.product_variations (id, product_id, sku, size, height, colour, paint_type, material, finish, price_adjustment, stock_quantity, production_lead_time_days) VALUES
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'MVP-ANM-001-S-P', 'Small', '15cm', 'Red', 'painted', 'PLA+', 'Matte', 0, 10, NULL),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'MVP-ANM-001-S-U', 'Small', '15cm', 'Red', 'unpainted', 'PLA+', 'Raw', -2000, 15, NULL),
  ('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 'MVP-ANM-001-L-P', 'Large', '25cm', 'Red', 'painted', 'PLA+', 'Matte', 3000, 5, NULL),
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', 'MVP-ANM-002-S-P', 'Small', '15cm', 'Dark Purple', 'painted', 'PLA+', 'Matte', 0, 8, NULL),
  ('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', 'MVP-ANM-002-S-U', 'Small', '15cm', 'Dark Purple', 'unpainted', 'PLA+', 'Raw', -1500, 7, NULL),
  ('50000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000003', 'MVP-BST-001-M-P', 'Medium', '20cm', 'Brown/Gold', 'painted', 'PLA+', 'Matte', 0, 5, 7),
  ('50000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000003', 'MVP-BST-001-L-P', 'Large', '30cm', 'Brown/Gold', 'painted', 'PLA+', 'Matte', 4000, 3, 10),
  ('50000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000004', 'MVP-SHR-001-M-P', 'Medium', '20cm', 'Black', 'painted', 'PLA+', 'Glossy', 0, 4, 10),
  ('50000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000004', 'MVP-SHR-001-L-P', 'Large', '30cm', 'Black', 'painted', 'PLA+', 'Glossy', 5000, 2, 14),
  ('50000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000005', 'MVP-ANM-003-S-P', 'Small', '15cm', 'Green/Black', 'painted', 'PLA+', 'Matte', 0, 12, NULL),
  ('50000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000006', 'MVP-SHR-002-S-P', 'Small', '15cm', 'Red/Blue', 'painted', 'PLA+', 'Matte', 0, 10, NULL),
  ('50000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000006', 'MVP-SHR-002-L-P', 'Large', '25cm', 'Red/Blue', 'painted', 'PLA+', 'Matte', 2500, 8, NULL),
  ('50000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000007', 'MVP-HRR-001-XS-P', 'Mini', '10cm', 'Multi', 'painted', 'PLA+', 'Glossy', 0, 20, NULL),
  ('50000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000008', 'MVP-FNK-001-CST', 'Standard', '10cm', 'Custom', 'painted', 'PLA+', 'Matte', 0, 0, 14),
  ('50000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000009', 'MVP-GAM-001-M-P', 'Medium', '20cm', 'Blue/Silver', 'painted', 'PLA+', 'Matte', 0, 6, NULL),
  ('50000000-0000-0000-0000-000000000016', '30000000-0000-0000-0000-000000000009', 'MVP-GAM-001-L-P', 'Large', '25cm', 'Blue/Silver', 'painted', 'PLA+', 'Matte', 2000, 6, NULL),
  ('50000000-0000-0000-0000-000000000017', '30000000-0000-0000-0000-000000000010', 'MVP-DSK-001-S-CR', 'Small', '12cm', 'Crystal Blue', 'unpainted', 'PLA+', 'Raw', 0, 10, NULL),
  ('50000000-0000-0000-0000-000000000018', '30000000-0000-0000-0000-000000000010', 'MVP-DSK-001-S-CG', 'Small', '12cm', 'Crystal Green', 'unpainted', 'PLA+', 'Raw', 0, 12, NULL),
  ('50000000-0000-0000-0000-000000000019', '30000000-0000-0000-0000-000000000011', 'MVP-MNI-001-XS', 'Mini', '5cm', 'Grey', 'unpainted', 'PLA+', 'Raw', 0, 30, NULL),
  ('50000000-0000-0000-0000-000000000020', '30000000-0000-0000-0000-000000000012', 'MVP-ANM-004-S-P', 'Small', '15cm', 'Purple/Gold', 'painted', 'PLA+', 'Matte', 0, 7, NULL),
  ('50000000-0000-0000-0000-000000000021', '30000000-0000-0000-0000-000000000012', 'MVP-ANM-004-L-P', 'Large', '25cm', 'Purple/Gold', 'painted', 'PLA+', 'Matte', 2500, 7, NULL);

-- ============================================
-- PRODUCT ATTRIBUTES
-- ============================================
INSERT INTO public.product_attributes (product_id, name, value) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Franchise', 'Attack on Titan'),
  ('30000000-0000-0000-0000-000000000001', 'Character', 'Eren Yeager'),
  ('30000000-0000-0000-0000-000000000002', 'Franchise', 'Naruto'),
  ('30000000-0000-0000-0000-000000000002', 'Character', 'Sasuke Uchiha'),
  ('30000000-0000-0000-0000-000000000003', 'Theme', 'Pirate'),
  ('30000000-0000-0000-0000-000000000003', 'Era', 'Golden Age'),
  ('30000000-0000-0000-0000-000000000004', 'Franchise', 'Marvel'),
  ('30000000-0000-0000-0000-000000000004', 'Character', 'Venom'),
  ('30000000-0000-0000-0000-000000000005', 'Franchise', 'My Hero Academia'),
  ('30000000-0000-0000-0000-000000000005', 'Character', 'Izuku Midoriya'),
  ('30000000-0000-0000-0000-000000000006', 'Franchise', 'Marvel'),
  ('30000000-0000-0000-0000-000000000006', 'Character', 'Spider-Man'),
  ('30000000-0000-0000-0000-000000000007', 'Franchise', 'IT'),
  ('30000000-0000-0000-0000-000000000007', 'Character', 'Pennywise'),
  ('30000000-0000-0000-0000-000000000008', 'Type', 'Customisable'),
  ('30000000-0000-0000-0000-000000000008', 'Style', 'Funko Pop'),
  ('30000000-0000-0000-0000-000000000009', 'Franchise', 'Halo'),
  ('30000000-0000-0000-0000-000000000009', 'Character', 'Master Chief'),
  ('30000000-0000-0000-0000-000000000010', 'Theme', 'Fantasy'),
  ('30000000-0000-0000-0000-000000000010', 'Type', 'Desk Accessory'),
  ('30000000-0000-0000-0000-000000000011', 'Theme', 'Retro Gaming'),
  ('30000000-0000-0000-0000-000000000011', 'Type', 'Keychain'),
  ('30000000-0000-0000-0000-000000000012', 'Franchise', 'Original'),
  ('30000000-0000-0000-0000-000000000012', 'Theme', 'Fantasy');

-- ============================================
-- SHIPPING ZONES
-- ============================================
INSERT INTO public.shipping_zones (id, name, districts, is_active) VALUES
  ('60000000-0000-0000-0000-000000000001', 'Colombo District', ARRAY['Colombo'], true),
  ('60000000-0000-0000-0000-000000000002', 'Western Province (excl. Colombo)', ARRAY['Gampaha', 'Kalutara'], true),
  ('60000000-0000-0000-0000-000000000003', 'Other Sri Lankan Districts', ARRAY['Kandy', 'Matale', 'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya', 'Trincomalee', 'Batticaloa', 'Ampara', 'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle'], true),
  ('60000000-0000-0000-0000-000000000004', 'Store Pickup', ARRAY['Store Pickup'], true);

-- ============================================
-- SHIPPING RATES
-- ============================================
INSERT INTO public.shipping_rates (zone_id, rate_type, base_rate, per_kg_rate, free_delivery_threshold, estimated_days_min, estimated_days_max) VALUES
  ('60000000-0000-0000-0000-000000000001', 'flat', 350.00, 50.00, 5000.00, 1, 2),
  ('60000000-0000-0000-0000-000000000002', 'flat', 450.00, 60.00, 7500.00, 2, 3),
  ('60000000-0000-0000-0000-000000000003', 'weight_based', 550.00, 80.00, 10000.00, 3, 5),
  ('60000000-0000-0000-0000-000000000004', 'free', 0.00, NULL, NULL, 0, 0);

-- ============================================
-- SITE SETTINGS
-- ============================================
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'MiniVersePrints'),
  ('site_description', 'Premium 3D-printed figures, busts, miniatures, and collectibles from Sri Lanka'),
  ('whatsapp_number', '+94782525156'),
  ('currency', 'LKR'),
  ('currency_symbol', 'Rs.'),
  ('cod_enabled', 'true'),
  ('cod_max_order_value', '25000'),
  ('cod_advance_payment_required', 'true'),
  ('cod_advance_percentage', '30'),
  ('instagram_url', 'https://instagram.com/miniverseprints'),
  ('facebook_url', 'https://facebook.com/miniverseprints'),
  ('store_address', 'MiniVersePrints, Colombo, Sri Lanka'),
  ('contact_email', 'hello@miniverseprints.lk'),
  ('payhere_mode', 'sandbox');

-- ============================================
-- HOMEPAGE BANNERS
-- ============================================
INSERT INTO public.homepage_banners (id, title, subtitle, image_url, link_url, sort_order, is_active) VALUES
  ('70000000-0000-0000-0000-000000000001', 'Welcome to MiniVersePrints', 'Premium 3D-Printed Figures & Collectibles from Sri Lanka', '/images/placeholder-banner.svg', '/shop', 0, true),
  ('70000000-0000-0000-0000-000000000002', 'Action Figures', 'Check out our latest action figures', '/images/placeholder-banner.svg', '/shop/category/action-figures', 1, true),
  ('70000000-0000-0000-0000-000000000003', 'Custom Orders', 'Get your own personalised figure', '/images/placeholder-banner.svg', '/custom-order', 2, true);

-- ============================================
-- BANK DETAILS
-- ============================================
INSERT INTO public.bank_details (bank_name, account_name, account_number, branch, is_active) VALUES
  ('Bank of Ceylon', 'MiniVersePrints', '8654321000', 'Colombo Fort Branch', true),
  ('People''s Bank', 'MiniVersePrints', '201123456789', 'Colombo Main Branch', false);

-- ============================================
-- COUPON (sample)
-- ============================================
INSERT INTO public.coupons (code, type, value, min_order_amount, usage_limit, per_customer_limit, starts_at, expires_at, is_active) VALUES
  ('WELCOME10', 'percentage', 10.00, 3000.00, 100, 1, now(), now() + INTERVAL '6 months', true),
  ('FREESHIP', 'free_delivery', 0, 5000.00, 50, 1, now(), now() + INTERVAL '3 months', true);
