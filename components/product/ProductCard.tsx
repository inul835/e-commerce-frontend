'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Rating from '../ui/Rating';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  onAddToCart?: () => void;
  isLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  image,
  category,
  rating = 0,
  reviewCount = 0,
  inStock = true,
  onAddToCart,
  isLoading = false,
}) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Link href={`/products/${id}`}>
      {/* 🖤 ডার্ক থিম কার্ড বডি */}
      <div className="bg-neutral-900/60 border border-neutral-800/60 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/30 transition-all duration-300 cursor-pointer h-full flex flex-col backdrop-blur-sm group">
        
        {/* Image Container */}
        <div className="relative w-full h-48 bg-neutral-950 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount > 0 && (
            <Badge variant="danger" className="absolute top-3 right-3 bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-md text-xs font-bold backdrop-blur-md">
              -{discount}%
            </Badge>
          )}
          {!inStock && (
            <Badge variant="gray" className="absolute top-3 left-3 bg-neutral-800/80 text-neutral-400 border border-neutral-700/50 px-2.5 py-0.5 rounded-md text-xs font-medium backdrop-blur-md">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {category && (
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 opacity-90">
                {category}
              </p>
            )}

            <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-amber-400 transition-colors duration-200">
              {title}
            </h3>

            {/* Rating */}
            <div className="mb-4 flex items-center gap-2">
              <Rating rating={rating} size="sm" />
              <p className="text-xs text-neutral-500 font-medium">({reviewCount})</p>
            </div>
          </div>

          <div>
            {/* Price সেকশন */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-amber-400">${price.toFixed(2)}</span>
                {originalPrice && (
                  <span className="text-xs text-neutral-600 line-through">${originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant={inStock ? 'primary' : 'secondary'}
              size="sm"
              fullWidth
              disabled={!inStock || isLoading}
              isLoading={isLoading}
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
              className={`w-full py-2.5 font-bold rounded-xl text-xs uppercase tracking-wider transition-all duration-300 active:scale-[0.98] ${
                inStock 
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-neutral-950 shadow-lg shadow-amber-500/10' 
                  : 'bg-neutral-800 text-neutral-500 border border-neutral-700/50 cursor-not-allowed'
              }`}
            >
              {inStock ? '🛒 Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;