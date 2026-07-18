'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer, Input, Button, Alert, OrderSummary } from '@/components';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';

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

      {/* 📦 Modern Minimalist Amazon Palette */}
      <main className="min-h-screen bg-[#f7f8fa] text-gray-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
        
        {/* 🏷️ Top Minimal Sub-Header */}
        <section className="bg-white border-b border-gray-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-gray-950 sm:text-2xl">
                Review your <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Order</span>
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                ({totalItems} items in your shopping basket)
              </p>
            </div>
            <Link href="/cart" className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline">
              ← Return to Cart
            </Link>
          </div>
        </section>

        {/* 🗛 Main Grid Layout */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* 📝 Left Content: Shipping and Methods */}
            <div className="lg:col-span-2 space-y-6">
              {!isAuthenticated && (
                <Alert type="error" className="rounded-2xl border-red-200/60 bg-red-50 text-red-700 text-sm">
                  You need to <Link href="/auth/login" className="font-bold text-amber-600 hover:underline">sign in</Link> before completing checkout.
                </Alert>
              )}

              {/* Shipping Form Card */}
              <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-950 mb-5 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <span className="text-amber-500">1</span> Shipping Address
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Street Address"
                    placeholder="123 Main St, Apt 4B"
                    value={address.street}
                    onChange={(e) => handleFieldChange('street', e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="City"
                      placeholder="New York"
                      value={address.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                    />
                    <Input
                      label="State / Province"
                      placeholder="NY"
                      value={address.state}
                      onChange={(e) => handleFieldChange('state', e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Zip / Postal Code"
                      placeholder="10001"
                      value={address.zipCode}
                      onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                    />
                    <Input
                      label="Country"
                      placeholder="United States"
                      value={address.country}
                      onChange={(e) => handleFieldChange('country', e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200"
                    />
                  </div>

                  {/* 💳 Payment Gateways Method Box */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h2 className="text-lg font-bold text-gray-950 mb-4 flex items-center gap-2">
                      <span className="text-amber-500">2</span> Select Payment Method
                    </h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { value: 'credit_card', label: '💳 Credit Card' },
                        { value: 'debit_card', label: '🏦 Debit Card' },
                        { value: 'paypal', label: '🔹 PayPal' },
                        { value: 'stripe', label: '⚡ Stripe' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPaymentMethod(option.value as typeof paymentMethod)}
                          className={`rounded-xl border p-3.5 text-center text-xs font-bold tracking-tight transition-all duration-200 ${
                            paymentMethod === option.value
                              ? 'border-amber-500 bg-amber-50/60 text-amber-700 shadow-sm ring-2 ring-amber-500/20'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order Notes Field */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Input
                      label="Delivery Instructions (Optional)"
                      textarea
                      placeholder="Add apartment codes, drop-off details, etc..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all duration-200 min-h-[80px]"
                    />
                  </div>

                  {status.message && (
                    <div className="mt-4">
                      <Alert type={status.type || 'success'} className="rounded-xl">
                        {status.message}
                      </Alert>
                    </div>
                  )}

                  {/* Hidden Form Submit Handler to trigger via Outer Layout Button */}
                  <button type="submit" id="hidden-checkout-submit" className="hidden" />
                </form>
              </div>
            </div>

            {/* 🛒 Right Sidebar: Sticky Amazon Style Order Summary */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-sm">
                
                {/* Core Place Order Call-To-Action Button */}
                <button
                  onClick={() => document.getElementById('hidden-checkout-submit')?.click()}
                  disabled={isSubmitting || cartLoading}
                  className="w-full mb-5 py-3 text-center text-sm font-extrabold text-gray-950 rounded-xl bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734] hover:border-[#846a29] shadow-sm disabled:opacity-50 active:scale-[0.99] transition-all duration-150"
                >
                  {isSubmitting ? 'Processing Order...' : 'Place Your Order'}
                </button>

                <p className="text-[11px] text-gray-500 text-center leading-relaxed mb-4 border-b border-gray-100 pb-4">
                  By placing your order, you agree to our brand's privacy notice and conditions of modern use.
                </p>

                <h3 className="text-base font-bold text-gray-950 mb-3">Order Summary</h3>
                <div className="modern-summary-wrapper text-sm">
                  <OrderSummary subtotal={subtotal} tax={tax} shipping={shipping} discount={0} items={totalItems} />
                </div>
              </div>

              {/* Security Shipping Notice Badge */}
              <div className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-sm text-xs text-gray-500 space-y-2">
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  🛡️ Secure Checkout Guarantee
                </h4>
                <p className="leading-relaxed">
                  Standard distribution rates apply based on location parameters. Orders over $100 trigger free premium shipping benefits.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}