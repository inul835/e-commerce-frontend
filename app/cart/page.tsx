'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer, CartItem, OrderSummary, Button } from '@/components';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { items, subtotal, shipping, tax, total, totalItems, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();

  // ফ্রি শিপিং প্রগ্রেস বার থ্রেশহোল্ড ($100)
  const isFreeShipping = subtotal >= 100;
  const amountNeededForFreeShipping = 100 - subtotal;

  return (
    <>
      <Header cartCount={totalItems} onCartClick={() => router.push('/cart')} />

      {/* 📦 Modern Minimalist Amazon Palette Background */}
      <main className="min-h-screen bg-[#f7f8fa] text-gray-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
        
        {/* 🏷️ Top Minimal Sub-Header */}
        <section className="bg-white border-b border-gray-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/95">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-950 sm:text-2xl">
              Shopping <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Cart</span>
            </h1>
          </div>
        </section>

        {/* 🛒 Main Content Container */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* 📋 Left Content: Items List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-gray-950">
                      {totalItems} Item{totalItems !== 1 ? 's' : ''} Selected
                    </h2>
                    <button
                      onClick={clearCart}
                      disabled={isLoading}
                      className="text-xs font-semibold text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors duration-150"
                    >
                      Clear All Items
                    </button>
                  </div>

                  {/* Cart Items List */}
                  <div className="divide-y divide-gray-100 space-y-4">
                    {items.map((item) => (
                      <div key={item.product._id} className="pt-4 first:pt-0">
                        <CartItem
                          product={item.product}
                          quantity={item.quantity}
                          onQuantityChange={(quantity) => updateQuantity(item.product._id, quantity)}
                          onRemove={() => removeFromCart(item.product._id)}
                          isLoading={isLoading}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Continue Shopping Trigger */}
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <Link href="/products" className="inline-block">
                      <Button variant="ghost" className="text-xs font-bold text-amber-600 hover:text-amber-700">
                        ← Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 💵 Right Sidebar: Amazon Sticky Checkout Summary Box */}
              <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4">
                
                {/* Free Shipping Alert Banner */}
                <div className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{isFreeShipping ? '🎉' : '📦'}</span>
                    <div className="text-xs">
                      {isFreeShipping ? (
                        <p className="text-emerald-700 font-bold">Your order qualifies for FREE Shipping.</p>
                      ) : (
                        <p className="text-gray-600">
                          Add <span className="font-bold text-amber-600">${amountNeededForFreeShipping.toFixed(2)}</span> more of eligible items to get <span className="font-bold">FREE Shipping</span>.
                        </p>
                      )}
                      
                      {/* Interactive Progress Bar */}
                      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${isFreeShipping ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Core Order Calculation Wrapper */}
                <div className="bg-white rounded-2xl border border-gray-200/70 p-6 shadow-sm">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}):{' '}
                      <span className="text-lg font-extrabold text-gray-950">${subtotal.toFixed(2)}</span>
                    </p>
                  </div>

                  {/* Action CTA Checkout Button */}
                  <button
                    type="button"
                    onClick={() => router.push('/checkout')}
                    className="w-full mb-6 py-3 text-center text-sm font-extrabold text-gray-950 rounded-xl bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734] hover:border-[#846a29] shadow-sm active:scale-[0.99] transition-all duration-150"
                  >
                    Proceed to Checkout
                  </button>

                  <div className="border-t border-gray-50 pt-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pricing Breakdown</h4>
                    <OrderSummary subtotal={subtotal} tax={tax} shipping={shipping} discount={0} items={totalItems} />
                  </div>
                </div>

                {/* Extra Minimal Specs Details */}
                <div className="p-4 bg-amber-50/40 border border-amber-500/10 rounded-2xl text-xs text-amber-800 space-y-1">
                  <p>✓ 10% standard value tax applied dynamically.</p>
                  <p>✓ Secure distribution lines ensure pristine parcel safety.</p>
                </div>
              </div>

            </div>
          ) : (
            /* Modern Empty Cart State Screen */
            <div className="rounded-2xl bg-white p-16 border border-gray-200/60 text-center shadow-sm max-w-md mx-auto mt-10">
              <span className="text-5xl block mb-4">🛒</span>
              <h2 className="text-xl font-extrabold text-gray-950 tracking-tight mb-1">Your Amazon Cart is empty</h2>
              <p className="text-gray-500 text-xs mb-6">Your shopping basket lives to serve. Give it purpose by adding items.</p>
              <Link href="/products">
                <Button
                  variant="primary"
                  className="w-full py-2.5 text-sm font-bold text-gray-950 rounded-xl bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] hover:from-[#f5d78e] hover:to-[#eeb933] border border-[#a88734] shadow-sm active:scale-[0.98] transition-all"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}