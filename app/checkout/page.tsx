'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer, Input, Button, Alert, OrderSummary } from '@/components';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi, paymentsApi } from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';

const initialAddress = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, tax, totalItems, clearCart, isLoading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const [address, setAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card' | 'paypal' | 'stripe'>('credit_card');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setStatus({ type: 'error', message: 'Please sign in before placing an order.' });
      return;
    }

    if (items.length === 0) {
      setStatus({ type: 'error', message: 'Your cart is empty. Add items before checking out.' });
      return;
    }

    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      setStatus({ type: 'error', message: 'Please complete your shipping address.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await ordersApi.create({
        shippingAddress: address,
        paymentMethod,
        notes,
      });

      clearCart();
      setStatus({ type: 'success', message: 'Order placed successfully! Redirecting to your orders...' });
      setTimeout(() => router.push('/orders'), 1200);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Checkout failed. Please try again.';
      setStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header cartCount={items.length} onCartClick={() => router.push('/cart')} />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Review your order, fill in shipping details, and complete payment.</p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {!isAuthenticated && (
                <Alert type="error">
                  You need to <Link href="/auth/login" className="font-semibold text-blue-600 hover:underline">sign in</Link> before completing checkout.
                </Alert>
              )}

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Street Address"
                    value={address.street}
                    onChange={(e) => handleFieldChange('street', e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      value={address.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      required
                    />
                    <Input
                      label="State"
                      value={address.state}
                      onChange={(e) => handleFieldChange('state', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Zip Code"
                      value={address.zipCode}
                      onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                      required
                    />
                    <Input
                      label="Country"
                      value={address.country}
                      onChange={(e) => handleFieldChange('country', e.target.value)}
                      required
                    />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Payment Method</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'credit_card', label: 'Credit Card' },
                        { value: 'debit_card', label: 'Debit Card' },
                        { value: 'paypal', label: 'PayPal' },
                        { value: 'stripe', label: 'Stripe' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPaymentMethod(option.value as typeof paymentMethod)}
                          className={`rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors ${
                            paymentMethod === option.value
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-blue-500'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Order Notes"
                    textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  {status.message && (
                    <Alert type={status.type || 'success'}>{status.message}</Alert>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      size="lg"
                      isLoading={isSubmitting || cartLoading}
                    >
                      Place Order
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      fullWidth
                      onClick={() => router.push('/products')}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <OrderSummary subtotal={subtotal} tax={tax} shipping={shipping} discount={0} items={totalItems} />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping</h2>
                <p className="text-gray-600">Standard shipping rates apply based on your location. Orders over $100 ship free.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
