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

      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Review your past purchases and track order status.</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-10">
          {!isAuthenticated ? (
            <Alert type="error">
              Please <Link href="/auth/login" className="font-semibold text-blue-600 hover:underline">sign in</Link> to view your orders.
            </Alert>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-28 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <Alert type="error">{error}</Alert>
          ) : orders.length === 0 ? (
            <div className="rounded-lg bg-white p-10 text-center">
              <p className="text-gray-700">You don't have any orders yet.</p>
              <Button variant="primary" onClick={() => router.push('/products')}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <button
                  key={order._id}
                  onClick={() => router.push(`/orders/${order._id}`)}
                  className="w-full text-left bg-white rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                      <p className="text-lg font-semibold text-gray-900">{order.orderStatus}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <p>Payment: {order.paymentStatus}</p>
                    <p>Items: {order.items.length}</p>
                    <p>Created: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
