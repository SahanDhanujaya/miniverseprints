import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/product/ProductGrid';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Product } from '@/types';
import { PRODUCTS_PER_PAGE } from '@/lib/constants';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { demoCategories, demoProducts, getDemoProductsByCategoryId } from '@/lib/demo-store';

export const revalidate = 60;

async function getShopData(searchParams: { [key: string]: string | undefined }) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';
  const category = searchParams.category || '';
  const sort = searchParams.sort || 'newest';
  const type = searchParams.type || '';
  const minPrice = searchParams.min_price ? parseInt(searchParams.min_price) : undefined;
  const maxPrice = searchParams.max_price ? parseInt(searchParams.max_price) : undefined;

  if (!hasSupabaseConfig()) {
    let filteredProducts = category ? getDemoProductsByCategoryId(category) : [...demoProducts];

    if (search) {
      const q = search.toLowerCase();
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(q) ||
        (product.short_description || '').toLowerCase().includes(q)
      );
    }

    if (type === 'ready_stock' || type === 'made_to_order') {
      filteredProducts = filteredProducts.filter((product) => product.product_type === type);
    }

    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.regular_price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((product) => product.regular_price <= maxPrice);
    }

    filteredProducts.sort((a, b) => {
      if (sort === 'price_low') return a.regular_price - b.regular_price;
      if (sort === 'price_high') return b.regular_price - a.regular_price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    const totalCount = filteredProducts.length;
    const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
    const from = (page - 1) * PRODUCTS_PER_PAGE;

    return {
      products: filteredProducts.slice(from, from + PRODUCTS_PER_PAGE),
      categories: demoCategories,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  const supabase = await createClient();
  let productIdsForCategory: string[] | null = null;

  if (category) {
    const { data: productIds } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', category);

    productIdsForCategory = (productIds || []).map((item) => item.product_id);
  }

  let query = supabase
    .from('products')
    .select('*, product_images(*)', { count: 'exact' })
    .eq('is_active', true);

  if (productIdsForCategory) {
    if (productIdsForCategory.length === 0) {
      return {
        products: [],
        categories: demoCategories,
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    query = query.in('id', productIdsForCategory);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%`);
  }

  if (type === 'ready_stock') {
    query = query.eq('product_type', 'ready_stock');
  } else if (type === 'made_to_order') {
    query = query.eq('product_type', 'made_to_order');
  }

  if (minPrice !== undefined) {
    query = query.gte('regular_price', minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte('regular_price', maxPrice);
  }

  // Sort
  switch (sort) {
    case 'price_low':
      query = query.order('regular_price', { ascending: true });
      break;
    case 'price_high':
      query = query.order('regular_price', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const from = (page - 1) * PRODUCTS_PER_PAGE;
  const to = from + PRODUCTS_PER_PAGE - 1;
  query = query.range(from, to);

  const { data: products, count, error } = await query;

  // Get categories for sidebar
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  return {
    products: (products || []) as Product[],
    categories: categories || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / PRODUCTS_PER_PAGE),
    currentPage: page,
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const { products, categories, totalCount, totalPages, currentPage } = await getShopData(params);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Breadcrumb items={[{ label: 'Shop' }]} />

      <div className="flex flex-col lg:flex-row gap-8 pb-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-background-card rounded-2xl border border-border p-6 sticky top-20">
            <h3 className="font-bold mb-4">Filters</h3>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 text-foreground-muted">Category</h4>
              <div className="space-y-2">
                <a href="/shop" className="block text-sm hover:text-accent transition-colors">All Categories</a>
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    className="block text-sm text-foreground-muted hover:text-accent transition-colors"
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Type */}
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2 text-foreground-muted">Availability</h4>
              <div className="space-y-2">
                <a href="/shop" className="block text-sm hover:text-accent transition-colors">All</a>
                <a href="/shop?type=ready_stock" className="block text-sm text-foreground-muted hover:text-accent transition-colors">Ready Stock</a>
                <a href="/shop?type=made_to_order" className="block text-sm text-foreground-muted hover:text-accent transition-colors">Made to Order</a>
              </div>
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-foreground-muted">Sort By</h4>
              <form action="/shop" className="space-y-2">
                {Object.entries(params)
                  .filter(([key, value]) => value && key !== 'sort' && key !== 'page')
                  .map(([key, value]) => (
                    <input key={key} type="hidden" name={key} value={value} />
                  ))}
                <select
                  name="sort"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm"
                  defaultValue={params.sort || 'newest'}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
                <button type="submit" className="w-full px-3 py-2 rounded-lg bg-background-hover text-sm font-medium hover:text-accent transition-colors">
                  Apply Sort
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-foreground-muted">{totalCount} products</p>
          </div>
          <ProductGrid products={products} />
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/shop?page=${p}&${new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString()}`}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    p === currentPage ? 'bg-accent text-white' : 'hover:bg-background-hover text-foreground-muted'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
