'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header, Footer, ProductCard, Button, Alert } from '@/components';
import { useCart } from '@/context/CartContext';
import { categoriesApi, productsApi } from '@/lib/api';
import type { Category, Product } from '@/types';

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { totalItems, addToCart, isLoading: cartLoading } = useCart();

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategory() {
      setIsLoading(true);
      setError(null);

      try {
        const categoryResponse = await categoriesApi.getBySlug(slug);
        setCategory(categoryResponse.data.category);
        setSubcategories(categoryResponse.data.subcategories);

        const productsResponse = await productsApi.getAll({
          category: categoryResponse.data.category._id,
          limit: 24,
        });
        setProducts(productsResponse.data.products);
      } catch (err) {
        setError('Unable to load this category. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadCategory();
    }
  }, [slug]);

  const handleAddToCart = async (product: Product) => {
    try {
      // @ts-ignore
      await addToCart(product._id, 1);
    } catch (err) {
      console.error('Failed to add item to cart', err);
    }
  };

  return (
    <>
      <Header cartCount={totalItems} onCartClick={() => router.push('/cart')} />

      {/* 📦 Modern Minimalist Amazon Palette Background */}
      <main className="min-h-screen bg-[#f7f8fa] text-gray-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
        
        {/* 🏷️ Dynamic Department Header Banner */}
        <section className="bg-white border-b border-gray-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-extrabold text-amber-600">Department Store</p>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl mt-1">
                {isLoading ? 'Loading Department...' : category?.name}
              </h1>
              {!isLoading && category?.description && (
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              )}
            </div>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/categories')}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 self-start sm:self-center"
            >
              ← All Departments
            </Button>
          </div>
        </section>

        {/* 🗃️ Content Grid Section */}
        <section className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          
          {error ? (
            <div className="rounded-2xl bg-red-50 p-5 border border-red-200/60 text-red-700 text-sm font-medium flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          ) : isLoading ? (
            /* Modern Skeleton Sync Loader */
            <div className="space-y-6">
              <div className="h-20 rounded-2xl bg-white border border-gray-100 p-6 animate-pulse" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="aspect-[3/4] rounded-2xl bg-white border border-gray-100 animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* 📂 Subcategories Department Chips */}
              {subcategories.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-sm">
                  <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">
                    Sub-Departments
                  </h2>
                  <div className="flex flex-wrap gap-2.5">
                    {subcategories.map((sub) => (
                      <button
                        key={sub._id}
                        onClick={() => router.push(`/categories/${encodeURIComponent(sub.slug)}`)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200/60 text-gray-700 hover:text-amber-600 hover:border-amber-500/40 hover:bg-amber-50/20 text-xs font-bold rounded-xl transition-all duration-200"
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 🛍️ Main Showcase Products Box */}
              <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-sm">
                <div className="mb-6 border-b border-gray-100 pb-4 flex items-center justify-between">
                  <h2 className="text-base font-bold text-gray-950">
                    Featured Results
                  </h2>
                  <p className="text-xs text-gray-500">
                    Showing <span className="font-bold text-gray-800">{products.length}</span> premium items
                  </p>
                </div>

                {products.length === 0 ? (
                  /* Empty State View */
                  <div className="text-center py-16 bg-[#f7f8fa] border border-dashed border-gray-200 rounded-xl px-4">
                    <span className="text-3xl block mb-3">📦</span>
                    <p className="text-gray-900 font-bold text-base mb-1">No products inside this department</p>
                    <p className="text-gray-500 text-xs mb-5">Check back later or explore other active premium collections.</p>
                    <Button
                      variant="ghost"
                      onClick={() => router.push('/products')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700"
                    >
                      Browse Full Catalogue
                    </Button>
                  </div>
                ) : (
                  /* Modern Grid Layout Display */
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <div 
                        key={product._id} 
                        className="group flex flex-col justify-between p-2 rounded-xl border border-transparent hover:border-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <ProductCard
                          id={product._id}
                          title={product.title}
                          price={product.price}
                          originalPrice={product.price + 100}
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
                )}
              </div>

            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}