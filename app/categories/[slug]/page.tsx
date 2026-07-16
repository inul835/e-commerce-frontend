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
    await addToCart(product);
  };

  return (
    <>
      <Header cartCount={totalItems} onCartClick={() => router.push('/cart')} />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Category</p>
                <h1 className="text-4xl font-semibold text-gray-900 mt-3">{category?.name || 'Loading...'}</h1>
                <p className="text-gray-600 mt-2">{category?.description || 'Browse items in this category.'}</p>
              </div>
              <Button variant="secondary" onClick={() => router.push('/categories')}>
                Back to categories
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-10">
          {error ? (
            <Alert type="error">{error}</Alert>
          ) : isLoading ? (
            <div className="space-y-6">
              <div className="h-12 rounded-3xl bg-gray-100 animate-pulse" />
              <div className="grid gap-6 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-72 rounded-3xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {subcategories.length > 0 && (
                <section className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Subcategories</h2>
                      <p className="text-sm text-gray-600">Explore related collections within this category.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {subcategories.map((sub) => (
                      <Button key={sub._id} fullWidth onClick={() => router.push(`/categories/${encodeURIComponent(sub.slug)}`)}>
                        {sub.name}
                      </Button>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Products in {category?.name}</h2>
                    <p className="text-sm text-gray-600">{products.length} items found</p>
                  </div>
                </div>

                {products.length === 0 ? (
                  <div className="rounded-3xl bg-gray-50 p-10 text-center">
                    <p className="text-gray-700">No products available in this category yet.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
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
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
