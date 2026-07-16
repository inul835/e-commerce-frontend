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

      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h1>
            <p className="text-gray-600">Browse through our latest categories and find the perfect items for your needs.</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
              <p className="text-gray-600 mt-1">Find products by curated category collections.</p>
            </div>
            <div className="max-w-sm w-full">
              <Input
                label="Search categories"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-3xl bg-white p-6 border border-red-200 text-red-700">{error}</div>
          ) : isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 border border-gray-200 text-center">
              <p className="text-gray-700">No categories match your search.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${encodeURIComponent(category.slug)}`}
                  className="group block rounded-3xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                      {category.parent && typeof category.parent !== 'string' && (
                        <p className="text-sm text-gray-500">Subcategory of {category.parent.name}</p>
                      )}
                    </div>
                    <span className="text-blue-600 text-2xl">➡</span>
                  </div>
                  <p className="text-gray-600 mb-5">{category.description ?? 'Explore products in this category.'}</p>
                  <Button variant="ghost">View products</Button>
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
