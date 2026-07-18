'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer, Button, Input } from '@/components';
import { categoriesApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import type { Category } from '@/types';

export default function CategoriesPage() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await categoriesApi.getAll();
        setCategories(response.data.categories);
        setFilteredCategories(response.data.categories);
      } catch (err) {
        setError('Unable to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    setFilteredCategories(
      categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        (category.description ?? '').toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, categories]);

  return (
    <>
      <Header cartCount={totalItems} onCartClick={() => router.push('/cart')} />

      {/* 📦 Modern Minimalist Amazon Background */}
      <main className="min-h-screen bg-[#f7f8fa] text-gray-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
        
        {/* 🏷️ Top Modern Banner */}
        <section className="bg-white border-b border-gray-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/90">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
                Shop by <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Category</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Discover exceptional collections curated precisely for your lifestyle.
              </p>
            </div>
            
            {/* 🔍 Premium Search Bar Container */}
            <div className="w-full md:max-w-md">
              <div className="relative group">
                <Input
                  placeholder="Search all departments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 pointer-events-none transition-colors duration-200">
                  🔍
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 🗃️ Categories Grid Section */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{filteredCategories.length}</span> active departments
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl bg-red-50 p-5 border border-red-200/60 text-red-700 text-sm font-medium flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          ) : isLoading ? (
            /* Modern Skeleton Loader */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-44 rounded-2xl bg-white border border-gray-100 p-6 flex flex-col justify-between animate-pulse">
                  <div className="space-y-3">
                    <div className="h-6 w-1/2 bg-gray-200 rounded-md" />
                    <div className="h-4 w-5/6 bg-gray-100 rounded-md" />
                  </div>
                  <div className="h-8 w-28 bg-gray-100 rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            /* Not Found Screen */
            <div className="rounded-2xl bg-white p-16 border border-gray-200/60 text-center shadow-sm max-w-xl mx-auto mt-10">
              <span className="text-4xl block mb-4">📦</span>
              <p className="text-gray-900 font-bold text-lg mb-1">No collections match your search</p>
              <p className="text-gray-500 text-sm mb-6">Double check the spelling or clear the filter field.</p>
              <Button 
                variant="ghost" 
                onClick={() => setSearch('')}
                className="text-amber-600 hover:text-amber-700 font-semibold"
              >
                Reset Search Filters
              </Button>
            </div>
          ) : (
            /* Modernized Category Showcase */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${encodeURIComponent(category.slug)}`}
                  className="group flex flex-col justify-between rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm hover:shadow-xl hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-200 tracking-tight">
                          {category.name}
                        </h3>
                        {category.parent && typeof category.parent !== 'string' && (
                          <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Sub of {category.parent.name}
                          </span>
                        )}
                      </div>
                      
                      {/* Slick Mini Chevron Button */}
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-all duration-300 transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">
                      {category.description ?? 'Explore premium products handpicked inside this category.'}
                    </p>
                  </div>
                  
                  {/* Modern Styled Button Interaction */}
                  <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-600 group-hover:underline uppercase tracking-wider">
                      Explore Now
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-xs text-gray-400 group-hover:text-gray-900 transition-colors duration-200"
                    >
                      View products
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}