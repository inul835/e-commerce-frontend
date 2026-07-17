'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer, ProductCard, Button } from '@/components';
import { productsApi, categoriesApi } from '@/lib/api';
import type { Category, Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { addToCart, totalItems, isLoading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getAll({ limit: 4, sort: 'rating' }),
          categoriesApi.getAll(),
        ]);

        setFeaturedProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
      } catch (err) {
        setError('Unable to load featured products right now. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSearchSubmit = (query: string) => {
    router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(product);
  };

  return (
    <>
      <Header cartCount={totalItems} onCartClick={() => router.push('/cart')} onSearchSubmit={handleSearchSubmit} />

      {/* 🏛️ Amazon Signature Light Gray Background Layout */}
      <main className="min-h-screen bg-[#eaeded] text-neutral-900 font-sans antialiased pb-12">
        
        {/* 📦 Amazon Style Clean Banner Section (ভিডিও রিমুভড, সাইজ একদম ০ এমবি!) */}
        <section className="relative bg-gradient-to-b from-neutral-200 to-[#eaeded] py-16 px-6 border-b border-neutral-300">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              Easily Request & Shop Premium Items With <span className="text-[#c45500]">EStore App</span>
            </h1>
            
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Discover a seamless, sleek, and reliable way to buy curated electronics, high-end accessories, and hyper-premium products from the comfort of your home.
            </p>
            
            <div className="flex gap-4 pt-2 justify-center flex-wrap">
              <Link href="/products">
                <button className="px-6 py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-neutral-950 font-normal rounded-full text-sm shadow-sm active:scale-95 transition-all">
                  Shop Now
                </button>
              </Link>
              <Link href="/sale">
                <button className="px-6 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-medium rounded-full text-sm shadow-sm active:scale-95 transition-all">
                  View Deals
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 🛍️ FEATURED PRODUCTS (Amazon Style Container) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white p-6 border border-neutral-200 rounded-none mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 border-b border-neutral-200 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Featured Products</h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-normal">Check out our top-tier best-selling items</p>
              </div>
              <Link href="/products">
                <Button variant="ghost" size="sm" className="text-[#007185] hover:text-[#c45500] hover:underline font-normal text-sm p-0">
                  View All Products <span className="ml-0.5">→</span>
                </Button>
              </Link>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-none text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* প্রোডাক্ট গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="aspect-[3/4] bg-neutral-100 border border-neutral-200 animate-pulse" />
                ))
              ) : (
                featuredProducts.map((product) => (
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
                ))
              )}
            </div>
          </div>
        </section>

        {/* 🗂️ SHOP BY CATEGORY */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
          <div className="bg-white p-6 border border-neutral-200 rounded-none">
            <div className="mb-6 border-b border-neutral-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Shop by Category</h2>
              <p className="text-xs sm:text-sm text-neutral-500">Browse our wide selection of minimal categories</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.length === 0
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-32 bg-neutral-100 border border-neutral-200 animate-pulse" />
                  ))
                : categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/products?category=${encodeURIComponent(category._id)}`}
                      className="p-4 bg-white border border-neutral-200 rounded-none hover:border-amber-500 transition-all text-center group"
                    >
                      <div className="text-3xl mb-2 transform group-hover:scale-105 transition-transform">🛍️</div>
                      <h3 className="font-bold text-neutral-800 text-xs mb-0.5 group-hover:text-[#c45500] group-hover:underline">{category.name}</h3>
                      <p className="text-[10px] text-neutral-400">Explore Collection</p>
                    </Link>
                  ))}
            </div>
          </div>
        </section>

        {/* 📊 STATS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 border border-neutral-200 rounded-none">
            {[
              { value: '10K+', label: 'Products Available' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '99.9%', label: 'Uptime Guarantee' },
              { value: '24/7', label: 'Expert Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center py-2">
                <p className="text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight">{stat.value}</p>
                <p className="text-xs font-medium text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ✉️ NEWSLETTER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white p-8 border border-neutral-200 rounded-none text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">Subscribe to Our Newsletter</h2>
            <p className="text-neutral-500 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
              Get the latest updates on exclusive drops, seasonal sales, and custom curated gear straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 rounded-sm text-sm focus:outline-none focus:border-amber-500 transition-all"
              />
              <button className="px-6 py-2 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] text-neutral-950 font-normal rounded-sm text-sm shadow-sm transition-all active:scale-[0.98]">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}