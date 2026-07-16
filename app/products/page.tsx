'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer, ProductCard, Input, Button } from '@/components';
import { productsApi, categoriesApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { Category, Product } from '@/types';

export default function ProductsPage() {
  const router = useRouter();
  const { totalItems, addToCart, isLoading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<{
    search: string;
    category: string;
    priceRange: [number, number];
    sort: 'newest' | 'price-asc' | 'price-desc' | 'rating';
  }>({
    search: '',
    category: '',
    priceRange: [0, 2000],
    sort: 'newest',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const queryParams = new URLSearchParams(window.location.search);
    const search = queryParams.get('search') || '';
    const category = queryParams.get('category') || '';
    const sort = (queryParams.get('sort') || 'newest') as 'newest' | 'price-asc' | 'price-desc' | 'rating';

    setFilters((current) => ({
      ...current,
      search,
      category,
      sort,
    }));
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await productsApi.getAll({
          search: filters.search,
          category: filters.category || undefined,
          sort: filters.sort,
          limit: 24,
        });
        setProducts(response.data.products);
      } catch (err) {
        setError('Unable to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [filters.search, filters.category, filters.sort]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await categoriesApi.getAll();
        setCategories(response.data.categories);
      } catch {
        // ignore category load failures
      }
    }

    loadCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    return (
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1]
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleSearchSubmit = (query: string) => {
    router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  // 🛒 ফিক্সড কার্ট হ্যান্ডলার (টাইপস্ক্রিপ্ট এরর খতম)
  async function handleAddToCart(product: any): Promise<void> {
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      console.error('Failed to add item to cart', err);
    }
  }

  return (
    <>
      <Header cartCount={totalItems} onCartClick={() => router.push('/cart')} onSearchSubmit={handleSearchSubmit} />

      {/* 🖤 আল্ট্রা ডার্ক লাক্সারি বডি */}
      <main className="min-h-screen bg-neutral-950 text-neutral-300 selection:bg-amber-400 selection:text-black antialiased">
        
        {/* 🏷️ পেজ হেডার সেকশন */}
        <section className="bg-neutral-900/40 border-b border-neutral-900 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              Our <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Catalogue</span>
            </h1>
            <p className="text-neutral-400 text-sm">Browse our full premium collection and filter by category, price, and rating.</p>
          </div>
        </section>

        {/* 🎛️ মেইন ফিল্টার ও প্রোডাক্ট গ্রিড কন্টেন্ট */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* フィルター - ফিল্টার সাইডবার বক্স */}
            <aside className="lg:col-span-1">
              <div className="bg-neutral-900/30 border border-neutral-900 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
                <h2 className="text-lg font-bold text-white mb-6 tracking-tight flex items-center gap-2">
                  <span>🎛️</span> Filters
                </h2>

                {/* সার্চ ফিল্টার */}
                <div className="mb-6">
                  <Input
                    label="Search"
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all"
                  />
                </div>

                {/* ক্যাটাগরি রেডিও ফিল্টার */}
                <div className="mb-6">
                  <h3 className="font-bold text-white text-sm mb-3 tracking-wide uppercase opacity-70">Category</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    <label className="flex items-center gap-2.5 cursor-pointer group text-neutral-400 hover:text-amber-400 transition-colors">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={filters.category === ''}
                        onChange={() => setFilters({ ...filters, category: '' })}
                        className="w-4 h-4 accent-amber-500 bg-neutral-950 border-neutral-800"
                      />
                      <span className="text-sm">All Products</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-2.5 cursor-pointer group text-neutral-400 hover:text-amber-400 transition-colors">
                        <input
                          type="radio"
                          name="category"
                          value={cat._id}
                          checked={filters.category === cat._id}
                          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                          className="w-4 h-4 accent-amber-500 bg-neutral-950 border-neutral-800"
                        />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* প্রাইজ রেঞ্জ ফিল্টার */}
                <div className="mb-6">
                  <h3 className="font-bold text-white text-sm mb-3 tracking-wide uppercase opacity-70">Price Range</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-neutral-400">
                        <span>Min Price</span>
                        <span className="text-amber-400 font-semibold">${filters.priceRange[0]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            priceRange: [parseInt(e.target.value), filters.priceRange[1]],
                          })
                        }
                        className="w-full accent-amber-500 bg-neutral-950 h-1 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-neutral-400">
                        <span>Max Price</span>
                        <span className="text-amber-400 font-semibold">${filters.priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                          })
                        }
                        className="w-full accent-amber-500 bg-neutral-950 h-1 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* সর্ট ড্রপডাউন */}
                <div className="mb-6">
                  <h3 className="font-bold text-white text-sm mb-3 tracking-wide uppercase opacity-70">Sort By</h3>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value as 'newest' | 'price-asc' | 'price-desc' | 'rating' })}
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all cursor-pointer"
                  >
                    <option value="newest" className="bg-neutral-950">Newest Arrival</option>
                    <option value="price-asc" className="bg-neutral-950">Price: Low to High</option>
                    <option value="price-desc" className="bg-neutral-950">Price: High to Low</option>
                    <option value="rating" className="bg-neutral-950">Highest Rated</option>
                  </select>
                </div>

                {/* রিসেট বাটন */}
                <button
                  className="w-full mt-2 py-2.5 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl text-xs bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
                  onClick={() =>
                    setFilters({
                      search: '',
                      category: '',
                      priceRange: [0, 2000],
                      sort: 'newest',
                    })
                  }
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* 🛍️ প্রোডাক্ট লিস্ট ও গ্রিড এরিয়া */}
            <div className="lg:col-span-3">
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-neutral-900/20 p-4 border border-neutral-900/60 rounded-2xl backdrop-blur-sm">
                <p className="text-neutral-400 text-sm">
                  Showing <span className="font-bold text-white">{sortedProducts.length}</span> premium products
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSearchSubmit(filters.search)}
                  className="text-white hover:text-amber-400 transition-colors"
                >
                  🔄 Refresh Search
                </Button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                  {error}
                </div>
              )}

              {/* স্কেলিটন লোডিং অবস্থা */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="aspect-[3/4] rounded-2xl bg-neutral-900 border border-neutral-800 animate-pulse" />
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                /* প্রোডাক্ট ডিসপ্লে গ্রিড */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      title={product.title}
                      price={product.price}
                      originalPrice={product.price + 80}
                      image={product.images[0] || '/placeholder.png'}
                      category={typeof product.category === 'string' ? product.category : product.category.name}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      inStock={product.inventory > 0}
                      onAddToCart={() => handleAddToCart(product)}
                      isLoading={cartLoading}
                    />
                  ))}
                </div>
              ) : (
                /* কোনো প্রোডাক্ট না পাওয়া গেলে */
                <div className="text-center py-20 border border-dashed border-neutral-900 rounded-3xl bg-neutral-900/10">
                  <p className="text-lg font-bold text-neutral-400 mb-4">No products match your custom filters</p>
                  <button
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 font-bold rounded-full text-xs shadow-md shadow-amber-500/10 active:scale-95 transition-all duration-200"
                    onClick={() =>
                      setFilters({
                        search: '',
                        category: '',
                        priceRange: [0, 2000],
                        sort: 'newest',
                      })
                    }
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}