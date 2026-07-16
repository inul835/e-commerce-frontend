'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header, Footer, Button, Rating, Review, Alert } from '@/components';
import { productsApi, reviewsApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import type { Product, Review as ReviewType } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, totalItems, isLoading: cartLoading, items } = useCart();
  const productId = Array.isArray(params?.id) ? params?.id[0] : params?.id ?? '';

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewStatus, setReviewStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      setLoading(true);
      setError(null);

      try {
        const [productRes, reviewRes] = await Promise.all([
          productsApi.getById(productId),
          reviewsApi.getForProduct(productId, 1, 'newest'),
        ]);

        setProduct(productRes.data.product);
        setSelectedImage(productRes.data.product.images[0] || '/placeholder.png');
        setReviews(reviewRes.data.reviews || []);
      } catch (err) {
        setError('Unable to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
    router.push('/cart');
  };

  const refreshReviews = async () => {
    if (!productId) return;
    try {
      const reviewRes = await reviewsApi.getForProduct(productId, 1, 'newest');
      setReviews(reviewRes.data.reviews || []);
    } catch {
      // ignore
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;

    if (!reviewTitle || !reviewComment) {
      setReviewStatus({ type: 'error', message: 'Please complete both title and comment.' });
      return;
    }

    setIsReviewSubmitting(true);
    setReviewStatus({ type: '', message: '' });

    try {
      await reviewsApi.create({
        productId,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      setReviewStatus({ type: 'success', message: 'Review submitted successfully.' });
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);
      await refreshReviews();
    } catch (err: unknown) {
      setReviewStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Unable to submit review. Please try again.',
      });
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const categoryName =
    typeof product?.category === 'string'
      ? product.category
      : product?.category?.name || 'Uncategorized';

  return (
    <>
      <Header cartCount={totalItems} onCartClick={() => router.push('/cart')} />

      {/* 🖤 আল্ট্রা ডার্ক লাক্সারি বডি */}
      <main className="min-h-screen bg-neutral-950 text-neutral-300 selection:bg-amber-400 selection:text-black antialiased">
        
        {/* 🏷️ পেজ হেডার সেকশন */}
        <section className="bg-neutral-900/40 border-b border-neutral-900 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <button
              type="button"
              onClick={() => router.push('/products')}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
            >
              ← Back to products
            </button>
            <h1 className="text-3xl font-black text-white mt-4 tracking-tight">
              Product <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Details</span>
            </h1>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 rounded-2xl bg-neutral-900 border border-neutral-800 animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse" />
                <div className="h-6 w-1/2 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse" />
                <div className="h-40 rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse" />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-10 text-center text-red-400">{error}</div>
          ) : product ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 📷 বাম পাশের ইমেজ এবং প্রোডাক্ট ডিটেইল বক্স */}
              <div className="lg:col-span-2 bg-neutral-900/30 border border-neutral-900 rounded-2xl p-6 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_80px] gap-4">
                  <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900 h-[420px] relative flex items-center justify-center">
                    <img src={selectedImage} alt={product.title} className="object-cover max-h-full w-full h-full" />
                  </div>
                  <div className="space-y-3 flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 md:gap-0">
                    {product.images.map((image) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        className={`w-20 md:w-full h-20 rounded-xl overflow-hidden border transition-all ${selectedImage === image ? 'border-amber-400 ring-2 ring-amber-500/20' : 'border-neutral-800 hover:border-neutral-700'} focus:outline-none shrink-0`}
                      >
                        <img src={image} alt={product.title} className="object-cover w-full h-full" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-black text-white tracking-tight">{product.title}</h2>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-2">{categoryName}</p>
                  
                  <div className="mt-4 flex items-center gap-3 bg-neutral-950/40 border border-neutral-900 w-fit px-3 py-1.5 rounded-full">
                    <Rating rating={product.rating} size="sm" />
                    <span className="text-xs text-neutral-400 font-medium">{product.reviewCount} verified reviews</span>
                  </div>
                  
                  <p className="mt-6 text-neutral-400 text-sm leading-relaxed">{product.description}</p>

                  {/* 📊 স্পেক্স গ্রিড */}
                  <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl bg-neutral-950 border border-neutral-900/60 p-4">
                      <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Price</p>
                      <p className="text-lg font-bold text-white mt-1">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl bg-neutral-950 border border-neutral-900/60 p-4">
                      <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Inventory</p>
                      <p className="text-lg font-bold text-white mt-1">{product.inventory} Pcs</p>
                    </div>
                    <div className="rounded-xl bg-neutral-950 border border-neutral-900/60 p-4">
                      <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">SKU</p>
                      <p className="text-sm font-bold text-neutral-300 mt-1.5 truncate">{product.sku}</p>
                    </div>
                    <div className="rounded-xl bg-neutral-950 border border-neutral-900/60 p-4">
                      <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Status</p>
                      <p className={`text-sm font-bold mt-1.5 ${product.inventory > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {product.inventory > 0 ? '✓ In Stock' : '✕ Out of Stock'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 💳 ডান পাশের পারচেজ অ্যাকশন বক্স */}
              <aside className="space-y-6">
                <div className="bg-neutral-900/30 border border-neutral-900 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
                  <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Total Value</p>
                  <p className="text-4xl font-black text-white mt-1">${product.price.toFixed(2)}</p>
                  
                  <div className="mt-6 flex items-center justify-between bg-neutral-950 border border-neutral-800 p-2 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg transition-colors border border-neutral-800 active:scale-95"
                    >
                      -
                    </button>
                    <span className="text-lg font-black text-white px-4">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-lg transition-colors border border-neutral-800 active:scale-95"
                    >
                      +
                    </button>
                  </div>

                  {/* বাই এবং কার্ট বাটন */}
                  <div className="space-y-3 mt-6">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={product.inventory === 0 || cartLoading}
                      className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-neutral-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/5 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
                    >
                      {cartLoading ? 'Adding...' : 'Add to Cart'}
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push('/checkout')}
                      disabled={items.length === 0}
                      className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white font-semibold rounded-xl text-sm active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                {/* লজিস্টিকস ইনফো বক্স */}
                <div className="bg-neutral-900/10 border border-neutral-900/60 rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider opacity-80">Logistics & Specs</h3>
                  <div className="space-y-3 text-xs text-neutral-400">
                    <p className="flex justify-between border-b border-neutral-900 pb-2"><span>Category:</span> <span className="text-neutral-200 font-medium">{categoryName}</span></p>
                    <p className="flex justify-between border-b border-neutral-900 pb-2"><span>Stock:</span> <span className="text-neutral-200 font-medium">{product.inventory} units available</span></p>
                    <p className="flex justify-between border-b border-neutral-900 pb-2"><span>SKU Identification:</span> <span className="text-neutral-200 font-mono font-medium">{product.sku}</span></p>
                    <p className="text-neutral-500 italic mt-2">📦 Managed securely by our internal warehouse and shipped within 1-2 premium business days.</p>
                  </div>
                </div>
              </aside>

              {/* 💬 রিভিউ সেকশন */}
              <div className="lg:col-span-3 bg-neutral-900/30 border border-neutral-900 rounded-2xl p-6 backdrop-blur-sm">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-neutral-900 pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Customer Reviews</h2>
                    <p className="text-xs text-neutral-400 mt-0.5">{reviews.length} total response{reviews.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-neutral-950 px-4 py-2 border border-neutral-800 rounded-xl">
                    <Rating rating={product.rating} size="sm" />
                    <span className="text-xs text-neutral-300 font-bold">Overall: {product.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* রিভিউ লিস্ট গ্রিড */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 4).map((review) => (
                      <div key={review._id} className="p-4 bg-neutral-950/40 border border-neutral-900 rounded-xl">
                        <Review
                          id={review._id}
                          author={{ name: `${review.user.firstName} ${review.user.lastName}`, avatar: review.user.avatar }}
                          rating={review.rating}
                          title={review.title}
                          comment={review.comment}
                          helpfulCount={review.helpfulCount}
                          createdAt={review.createdAt}
                          onMarkHelpful={() => {}}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-center text-neutral-500 bg-neutral-950/10">
                    No reviews yet for this premium product. Be the first to share your thoughts!
                  </div>
                )}

                {/* 📝 রিভিউ রাইটিং ফর্ম */}
                <div className="mt-8 rounded-2xl border border-neutral-900 bg-neutral-950/70 p-6 shadow-inner">
                  <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Write a Review</h3>

                  {!isAuthenticated ? (
                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 text-amber-400/90 text-sm rounded-xl">
                      Please sign in to submit a review.{' '}
                      <button type="button" className="font-bold text-amber-400 underline" onClick={() => router.push('/auth/login')}>
                        Sign in here
                      </button>.
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-5">
                      {reviewStatus.message && (
                        <div className={`p-4 rounded-xl text-xs border ${reviewStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                          {reviewStatus.message}
                        </div>
                      )}

                      {/* রেটিং সিলেক্টর */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Rating SCORE</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setReviewRating(value)}
                              className={`w-10 h-10 rounded-xl border text-sm font-black transition-all active:scale-95 ${
                                reviewRating === value
                                  ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-md shadow-amber-500/5'
                                  : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 hover:text-white'
                              }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ইনপুট ফিল্ডস */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Review Title</label>
                        <input
                          type="text"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-amber-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-neutral-600"
                          placeholder="Summarize your experience..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Your Review</label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full min-h-[140px] bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-amber-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-neutral-600 resize-none"
                          placeholder="Tell us what you liked or what could be improved..."
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isReviewSubmitting}
                        className="px-6 py-3 bg-white hover:bg-neutral-100 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider active:scale-95 disabled:opacity-50 transition-all duration-200 shadow-md"
                      >
                        {isReviewSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-900 bg-neutral-900/20 p-10 text-center text-neutral-500">Product not found.</div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}