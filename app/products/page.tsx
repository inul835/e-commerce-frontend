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
      } catch (box) {
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

      {/* 📦 Modern Minimalist Amazon Palette Background */}
      <main className="min-h-screen bg-[#f7f8fa] text-gray-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
        
        {/* 🏷️ Top Sticky Results Navigation Banner */}
        <section className="bg-white border-b border-gray-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
            <div>
              <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Browsing Results</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <h1 className="text-lg font-extrabold tracking-tight text-gray-950">
                  "{filters.search || 'All Core Departments'}"
                </h1>
                <span className="text-gray-400 text-xs">({sortedProducts.length} premium items found)</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleSearchSubmit(filters.search)}
              className="text-xs font-bold text-[#0066c0] hover:text-amber-600 transition-colors"
            >
              🔄 Refresh Showcase
            </Button>
          </div>
        </section>

        {/* 🎛️ Main Layout Grid Setup */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* フィルター - Left Modern Sidebar Panel */}
            <aside className="lg:col-span-1 bg-white p-6 border border-gray-200/70 rounded-2xl shadow-sm space-y-6 lg:sticky lg:top-24">
              <div>
                <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">
                  Refine Collection
                </h2>
              </div>

              {/* Keyword Search Field Box */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Filter Keywords</label>
                <Input
                  type="text"
                  placeholder="Type parameters..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-amber-500 text-gray-900 text-xs rounded-xl focus:outline-none transition-all"
                />
              </div>

              {/* Departments Radio Selectors */}
              <div>
                <h3 className="text-xs font-extrabold text-gray-900 mb-3 uppercase tracking-wider">Department</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-gray-600 hover:text-amber-600 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ''}
                      onChange={() => setFilters({ ...filters, category: '' })}
                      className="w-4 h-4 accent-amber-500 border-gray-300 focus:ring-0"
                    />
                    <span className={filters.category === '' ? 'font-bold text-amber-600' : ''}>Any Department</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-gray-600 hover:text-amber-600 transition-colors">
                      <input
                        type="radio"
                        name="category"
                        value={cat._id}
                        checked={filters.category === cat._id}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="w-4 h-4 accent-amber-500 border-gray-300 focus:ring-0"
                      />
                      <span className={filters.category === cat._id ? 'font-bold text-amber-600' : ''}>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Ranges Slicers */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-xs font-extrabold text-gray-900 mb-3 uppercase tracking-wider">Budget Parameters</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-[11px] font-bold text-gray-500">
                    <span>Min: <b className="text-gray-900 font-extrabold">${filters.priceRange[0]}</b></span>
                    <span>Max: <b className="text-gray-900 font-extrabold">${filters.priceRange[1]}</b></span>
                  </div>
                  <div className="space-y-3 pt-1">
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
                      className="w-full accent-amber-500 h-1 bg-gray-100 rounded-lg cursor-pointer"
                    />
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
                      className="w-full accent-amber-500 h-1 bg-gray-100 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Pipeline Selector Dropdown */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-xs font-extrabold text-gray-900 mb-2 uppercase tracking-wider">Sort Architecture</h3>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value as 'newest' | 'price-asc' | 'price-desc' | 'rating' })}
                  className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl focus:outline-none cursor-pointer transition-colors"
                >
                  <option value="newest">Featured / Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Avg. Customer Review</option>
                </select>
              </div>

              {/* Clean Filters Action Button */}
              <button
                className="w-full py-2.5 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-bold rounded-xl text-xs bg-white shadow-sm active:scale-[0.99] transition-all duration-150"
                onClick={() =>
                  setFilters({
                    search: '',
                    category: '',
                    priceRange: [0, 2000],
                    sort: 'newest',
                  })
                }
              >
                Clear Active Filters
              </button>
            </aside>

            {/* 🛍️ Right Content Showcase Area */}
            <div className="lg:col-span-3 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200/60 rounded-2xl text-red-700 text-xs font-semibold flex items-center gap-2">
                  ⚠️ {error}
                </div>
              )}

              {/* Loading Skeleton Mode */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="aspect-[3/4] bg-white border border-gray-200/60 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                /* Main Product Responsive Grid layout */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <div key={product._id} className="h-full">
                      <ProductCard
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
                    </div>
                  ))}
                </div>
              ) : (
                /* Clean Empty Filter Search Results screen */
                <div className="text-center py-16 bg-white border border-gray-200/70 rounded-2xl shadow-sm px-6 max-w-md mx-auto mt-6">
                  <span className="text-4xl block mb-3">🔍</span>
                  <p className="text-gray-950 font-bold text-base mb-1">No matching results found</p>
                  <p className="text-gray-500 text-xs mb-6">Try broadening your search keywords or resetting your parameters.</p>
                  <button
                    className="w-full py-2.5 text-sm font-bold text-gray-950 rounded-xl bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734] shadow-sm active:scale-[0.98] transition-all"
                    onClick={() =>
                      setFilters({
                        search: '',
                        category: '',
                        priceRange: [0, 2000],
                        sort: 'newest',
                      })
                    }
                  >
                    Reset All Filters
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