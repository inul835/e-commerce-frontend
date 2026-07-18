'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer, Button, Alert } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/types';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await ordersApi.getAll(1, 12);
        setOrders(response.data.orders || []);
      } catch (err) {
        setError('Unable to load order history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [isAuthenticated]);

  return (
    <>
      <Header cartCount={0} onCartClick={() => router.push('/cart')} />

      {/* 📦 Modern Minimalist Amazon Background */}
      <main className="min-h-screen bg-[#f7f8fa] text-gray-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
        
        {/* 🏷️ Top Modern Title Banner */}
        <section className="bg-white border-b border-gray-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/95">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
              Your <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Orders</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Track packages, check payment statuses, and review your premium order history.
            </p>
          </div>
        </section>

        {/* 📋 Main Orders Layout */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          {!isAuthenticated ? (
            <Alert type="error" className="rounded-2xl border-red-200/60 bg-red-50 text-red-700 text-sm">
              Please <Link href="/auth/login" className="font-bold text-amber-600 hover:underline">sign in</Link> to securely view your order logs.
            </Alert>
          ) : isLoading ? (
            /* Modernized Skeleton Loader */
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-36 rounded-2xl bg-white border border-gray-200 p-6 flex flex-col justify-between animate-pulse">
                  <div className="h-8 bg-gray-100 rounded-xl w-full" />
                  <div className="h-12 bg-gray-50 rounded-xl w-3/4 mt-4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert type="error" className="rounded-2xl">{error}</Alert>
          ) : orders.length === 0 ? (
            /* Empty Orders Screen */
            <div className="rounded-2xl bg-white p-12 border border-gray-200 text-center shadow-sm max-w-md mx-auto mt-6">
              <span className="text-4xl block mb-4">🛒</span>
              <p className="text-gray-950 font-bold text-lg mb-2">You haven't placed any orders yet</p>
              <p className="text-gray-500 text-xs mb-6">Explore our curated departments to find premium products.</p>
              <Button
                variant="primary"
                onClick={() => router.push('/products')}
                className="w-full py-2.5 text-sm font-bold text-gray-950 rounded-xl bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734] shadow-sm active:scale-[0.98] transition-all"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            /* Modern Amazon Card-Style List */
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200"
                >
                  {/* 💳 Top Gray Row Header (Classic Amazon Component) */}
                  <div className="bg-[#f0f2f2] px-6 py-3.5 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between text-xs text-gray-600">
                    <div className="flex gap-6 flex-wrap">
                      <div>
                        <p className="uppercase font-bold tracking-wider text-[10px] text-gray-500 mb-0.5">Order Placed</p>
                        <p className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="uppercase font-bold tracking-wider text-[10px] text-gray-500 mb-0.5">Total Amount</p>
                        <p className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="uppercase font-bold tracking-wider text-[10px] text-gray-500 mb-0.5">Items Count</p>
                        <p className="font-semibold text-gray-800">{order.items.length} package(s)</p>
                      </div>
                    </div>
                    <div className="text-right sm:text-right">
                      <p className="uppercase font-bold tracking-wider text-[10px] text-gray-500 mb-0.5">Order ID</p>
                      <p className="font-mono font-medium text-gray-700">#{order.orderNumber}</p>
                    </div>
                  </div>

                  {/* 📦 Bottom Content Area */}
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        <h2 className="text-lg font-bold text-gray-950 tracking-tight">
                          Status: {order.orderStatus}
                        </h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <p className="inline-flex items-center gap-1">
                          💳 Payment: <span className="font-bold text-gray-700">{order.paymentStatus}</span>
                        </p>
                        <span className="hidden sm:inline text-gray-300">|</span>
                        <p>Verified Secure Distribution</p>
                      </div>
                    </div>

                    {/* Action Dynamic Action Button */}
                    <div className="flex sm:justify-end">
                      <button
                        onClick={() => router.push(`/orders/${order._id}`)}
                        className="px-5 py-2 text-xs font-bold text-gray-800 rounded-xl bg-white border border-gray-300 shadow-sm hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-all duration-150"
                      >
                        View Details & Invoice →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}