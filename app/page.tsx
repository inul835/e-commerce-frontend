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

      {/* 🖤 আল্ট্রা ডার্ক লাক্সারি বডি */}
      <main className="min-h-screen bg-neutral-950 text-neutral-300 selection:bg-amber-400 selection:text-black antialiased">
        
        {/* ✨ সিনেমাটিক হিরো সেকশন (১০০% ক্লিন, নো ইরিটেটিং বক্স!) */}
        <section className="relative overflow-hidden min-h-[85vh] flex flex-col justify-center items-center text-center px-6">
          
          {/* 🎥 সম্পূর্ণ ব্যাকগ্রাউন্ড জুড়ে লোকাল ভিডিও লুপ */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover opacity-35 scale-100"
            >
              {/* তোর public/ ফোল্ডারের bg-animation.mp4 ফাইলটা এখানে প্লে হবে */}
              <source src="/bg-animation.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* ভিডিওর ওপর প্রিমিয়াম ডার্ক ওভারলে গ্রেডিয়েন্ট ও হালকা ব্লার */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-neutral-950" />
            <div className="absolute inset-0 bg-neutral-950/10 backdrop-blur-[1px]" />
          </div>
          
          {/* 📝 ভিডিওর ওপরে ভাসমান সিনেমাটিক মিনিমাল ই-কমার্স কন্টেন্ট */}
          <div className="max-w-4xl mx-auto relative z-10 space-y-8 py-20">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] drop-shadow-lg">
              Easily Request & Shop Premium Items With <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">EStore App</span>
            </h1>
            
            <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Discover a seamless, sleek, and reliable way to buy curated electronics, high-end accessories, and hyper-premium products from the comfort of your home.
            </p>
            
            <div className="flex gap-4 pt-4 justify-center flex-wrap">
              <Link href="/products">
                <button className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-neutral-950 font-bold rounded-full text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition-all duration-200">
                  Shop Now
                </button>
              </Link>
              <Link href="/sale">
                <button className="px-8 py-3.5 border border-white/20 hover:border-white/40 text-white font-semibold rounded-full text-sm bg-white/5 active:scale-95 transition-all duration-200 backdrop-blur-md">
                  View Deals
                </button>
              </Link>
            </div>
            
          </div>
        </section>

        {/* 🛍️ FEATURED PRODUCTS */}
        <section className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Featured Products</h2>
              <p className="text-neutral-400 font-normal">Check out our top-tier best-selling items</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" size="md" className="group text-white hover:text-amber-400 transition-colors">
                View All Products <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-1">→</span>
              </Button>
            </Link>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* প্রোডাক্ট গ্রিড */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-[3/4] rounded-2xl bg-neutral-900 border border-neutral-800 animate-pulse" />
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
        </section>

        {/* 🗂️ SHOP BY CATEGORY */}
        <section className="bg-neutral-900/40 py-20 border-t border-b border-neutral-900 backdrop-blur-md relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Shop by Category</h2>
              <p className="text-neutral-400">Browse our wide selection of minimal categories</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.length === 0
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-40 rounded-2xl bg-neutral-900 border border-neutral-800 animate-pulse" />
                  ))
                : categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/products?category=${encodeURIComponent(category._id)}`}
                      className="p-6 bg-neutral-950/40 border border-neutral-900 rounded-2xl hover:bg-neutral-900/60 hover:border-amber-500/30 transition-all duration-300 text-center group"
                    >
                      <div className="text-4xl mb-3 transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">🛍️</div>
                      <h3 className="font-bold text-white text-sm mb-1 group-hover:text-amber-400 transition-colors">{category.name}</h3>
                      <p className="text-xs text-neutral-500">Explore Collection</p>
                    </Link>
                  ))}
            </div>
          </div>
        </section>

        {/* 📊 STATS */}
        <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 bg-neutral-900/20 p-8 md:p-12 border border-neutral-900 rounded-3xl backdrop-blur-md">
            {[
              { value: '10K+', label: 'Products Available' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '99.9%', label: 'Uptime Guarantee' },
              { value: '24/7', label: 'Expert Support' },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <p className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-tight">{stat.value}</p>
                <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ✉️ NEWSLETTER */}
        <section className="py-24 relative overflow-hidden border-t border-neutral-900 bg-gradient-to-b from-transparent to-neutral-950 z-10">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Subscribe to Our Newsletter</h2>
            <p className="text-neutral-400 max-w-md mx-auto text-sm leading-relaxed">
              Get the latest updates on exclusive drops, seasonal sales, and custom curated gear straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
              <button className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-500 text-black font-bold rounded-full transition-all duration-300 active:scale-[0.98]">
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