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

  // আমাজন স্টাইলে প্রাইসের পূর্ণসংখ্যা ও দশমিক আলাদা করার ট্রিক
  const priceString = price.toFixed(2);
  const [wholePart, decimalPart] = priceString.split('.');

  return (
    <Link href={`/products/${id}`}>
      {/* 📦 Amazon Dark Theme Card Body */}
      <div className="bg-[#232f3e] border border-neutral-700 rounded-none overflow-hidden hover:border-amber-500 transition-all duration-200 cursor-pointer h-full flex flex-col group p-4">
        
        {/* Image Container */}
        <div className="relative w-full h-48 bg-white overflow-hidden rounded-sm flex items-center justify-center p-2">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-102"
          />
          {discount > 0 && (
            <Badge variant="danger" className="absolute top-2 left-2 bg-[#b12704] text-white border-none px-2 py-0.5 rounded-sm text-xs font-bold">
              {discount}% OFF
            </Badge>
          )}
          {!inStock && (
            <Badge variant="gray" className="absolute top-2 right-2 bg-neutral-800/90 text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded-sm text-xs font-medium">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="pt-3 flex-1 flex flex-col justify-between">
          <div>
            {category && (
              <p className="text-xs text-neutral-400 mb-0.5 capitalize">
                {category}
              </p>
            )}

            {/* Amazon Style Title (Clean Text, Hover Undeline feel) */}
            <h3 className="text-sm font-medium text-white line-clamp-2 mb-1 group-hover:text-amber-500 transition-colors duration-150">
              {title}
            </h3>

            {/* Rating - Amazon Signatures */}
            <div className="mb-2 flex items-center gap-1">
              <Rating rating={rating} size="sm" />
              <p className="text-xs text-[#00a8e8] hover:text-amber-500 hover:underline font-normal">
                {reviewCount} ratings
              </p>
            </div>
          </div>

          <div>
            {/* Price সেকশন (Amazon Style Super Script Price) */}
            <div className="mb-3">
              <div className="flex items-start gap-1 text-white">
                <span className="text-xs font-medium pt-1">$</span>
                <span className="text-2xl font-bold leading-none">{wholePart}</span>
                <span className="text-xs font-medium pt-1">{decimalPart}</span>
                
                {originalPrice && (
                  <span className="text-xs text-neutral-400 line-through pl-2 self-center">
                    List: ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Amazon Signature Yellow Add to Cart Button */}
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
              className={`w-full py-2 font-normal rounded-full text-xs text-neutral-950 transition-all active:scale-[0.99] border ${
                inStock 
                  ? 'bg-[#febd69] hover:bg-[#f3a847] border-[#a88734] shadow-sm' 
                  : 'bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed'
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