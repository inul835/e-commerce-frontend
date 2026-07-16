'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header, Footer, Button, Alert, OrderSummary } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/types';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info' | ''; message: string }>({ type: '', message: '' });

  useEffect(() => {
    async function loadOrder() {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await ordersApi.getById(orderId);
        setOrder(response.data.order);
      } catch (error) {
        setStatusMessage({ type: 'error', message: 'Unable to load order details. Please try again later.' });
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId, isAuthenticated]);

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await ordersApi.cancel(order._id);
      setStatusMessage({ type: 'success', message: 'Order cancelled successfully.' });
      setOrder({ ...order, orderStatus: 'cancelled' as const });
    } catch (error) {
      setStatusMessage({ type: 'error', message: 'Unable to cancel this order.' });
    }
  };

  return (
    <>
      <Header cartCount={0} onCartClick={() => router.push('/cart')} />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-600">Order details</p>
              <h1 className="text-3xl font-semibold text-gray-900">Order #{order?.orderNumber || 'Loading...'}</h1>
            </div>
            <Button variant="secondary" onClick={() => router.push('/orders')}>
              Back to Orders
            </Button>
          </div>

          {statusMessage.message && <Alert type={statusMessage.type || 'info'}>{statusMessage.message}</Alert>}

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-28 rounded-lg bg-white p-6 shadow-sm animate-pulse" />
              <div className="h-80 rounded-lg bg-white p-6 shadow-sm animate-pulse" />
            </div>
          ) : !isAuthenticated ? (
            <Alert type="error">Please sign in to view order details.</Alert>
          ) : !order ? (
            <Alert type="error">Order not found.</Alert>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <section className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      <h2 className="text-2xl font-semibold text-gray-900">{order.orderStatus}</h2>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-gray-500">Payment</p>
                      <p className="font-semibold text-gray-900 capitalize">{order.paymentStatus}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-gray-50 p-5 border border-gray-200">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Shipping Address</p>
                      <p className="font-medium text-gray-900">{order.shippingAddress.street}</p>
                      <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      <p className="text-gray-600">{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
                    </div>
                    <div className="rounded-3xl bg-gray-50 p-5 border border-gray-200">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Payment Method</p>
                      <p className="font-medium text-gray-900 capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                      {order.trackingNumber && (
                        <p className="text-gray-600 mt-2">Tracking: {order.trackingNumber}</p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-5">Items in this order</h2>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.product._id} className="grid gap-4 sm:grid-cols-[1fr_2fr] items-center rounded-3xl border border-gray-200 p-4">
                        <div className="h-28 w-full overflow-hidden rounded-2xl bg-gray-100">
                          <img src={item.product.images[0] ?? '/placeholder.png'} alt={item.product.title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.product.title}</p>
                          <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                          <p className="text-sm text-gray-600 mt-2">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-900 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <OrderSummary
                  subtotal={order.summary?.subtotal ?? order.totalAmount - order.tax - order.shippingCost}
                  tax={order.tax}
                  shipping={order.shippingCost}
                  discount={0}
                  items={order.items.length}
                />

                {['pending', 'processing'].includes(order.orderStatus) && (
                  <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Manage order</h3>
                    <p className="text-sm text-gray-600 mb-4">You can cancel this order if it hasn't shipped yet.</p>
                    <Button variant="danger" fullWidth onClick={handleCancelOrder}>
                      Cancel Order
                    </Button>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
