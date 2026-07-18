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

  // আমাজন মডার্ন স্টাইলে প্রাইসের পূর্ণসংখ্যা ও দশমিক আলাদা করার ট্রিক
  const priceString = price.toFixed(2);
  const [wholePart, decimalPart] = priceString.split('.');

  return (
    <Link href={`/products/${id}`} className="block h-full">
      {/* 📦 Modern Minimalist Amazon Card Body */}
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-full flex flex-col group p-5 shadow-sm">
        
        {/* Image Container */}
        <div className="relative w-full h-48 bg-gray-50/50 overflow-hidden rounded-xl flex items-center justify-center p-4 transition-colors group-hover:bg-gray-50">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge variant="danger" className="absolute top-3 left-3 bg-[#cc0c39] text-white border-none px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase shadow-sm">
              {discount}% OFF
            </Badge>
          )}
          {!inStock && (
            <Badge variant="gray" className="absolute top-3 right-3 bg-gray-200 text-gray-600 border border-gray-300 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Content Box */}
        <div className="pt-4 flex-1 flex flex-col justify-between">
          <div>
            {category && (
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 mb-1">
                {category}
              </p>
            )}

            {/* Modern Amazon Title Style */}
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1.5 leading-snug group-hover:text-amber-600 transition-colors duration-200 tracking-tight">
              {title}
            </h3>

            {/* Rating - Modern Touch */}
            <div className="mb-3 flex items-center gap-1.5">
              <Rating rating={rating} size="sm" />
              <p className="text-xs text-[#0066c0] font-medium group-hover:underline">
                ({reviewCount})
              </p>
            </div>
          </div>

          <div>
            {/* Price Box */}
            <div className="mb-4">
              <div className="flex items-start gap-0.5 text-gray-950">
                <span className="text-xs font-bold pt-0.5">$</span>
                <span className="text-2xl font-black tracking-tight leading-none">{wholePart}</span>
                <span className="text-xs font-bold pt-0.5">{decimalPart}</span>
                
                {originalPrice && (
                  <span className="text-xs text-gray-400 line-through pl-2 self-center font-medium">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Modern Styled Amazon Action Button */}
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
              className={`w-full py-2.5 text-xs font-extrabold rounded-xl transition-all duration-200 active:scale-[0.98] border shadow-sm ${
                inStock 
                  ? 'bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] hover:from-[#f5d78e] hover:to-[#eeb933] text-gray-950 border-[#a88734] hover:border-[#846a29]' 
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none'
              }`}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;