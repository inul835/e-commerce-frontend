'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer, CartItem, OrderSummary, Button } from '@/components';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const router = useRouter();
  const { items, subtotal, shipping, tax, total, totalItems, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();

  return (
    <>
      <Header cartCount={totalItems} onCartClick={() => router.push('/cart')} />

      <main className="min-h-screen bg-gray-50">
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-8">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    {items.length} Item{items.length !== 1 ? 's' : ''} in Cart
                  </h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <CartItem
                        key={item.product._id}
                        product={item.product}
                        quantity={item.quantity}
                        onQuantityChange={(quantity) => updateQuantity(item.product._id, quantity)}
                        onRemove={() => removeFromCart(item.product._id)}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link href="/products">
                      <Button variant="ghost">← Continue Shopping</Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <OrderSummary subtotal={subtotal} tax={tax} shipping={shipping} discount={0} items={totalItems} />

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => router.push('/checkout')}
                    className="w-full rounded-lg bg-blue-600 text-white px-4 py-3 text-base font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    type="button"
                    onClick={clearCart}
                    disabled={isLoading}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">✓ Free shipping on orders over $100</p>
                  <p className="text-sm text-blue-900 mt-1">✓ 10% tax applied</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to get started!</p>
              <Link href="/products">
                <Button variant="primary" size="lg">
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
