'use client';

import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import type { Product } from '@/types';

interface CartItemProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  isLoading?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  product,
  quantity,
  onQuantityChange,
  onRemove,
  isLoading = false,
}) => {
  const totalPrice = product.price * quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
        <p className="text-lg font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
        <p className="text-sm text-gray-500">
          ${product.price.toFixed(2)} × {quantity}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={isLoading}
          className="px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          −
        </button>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
          disabled={isLoading}
          className="w-12 text-center border border-gray-300 rounded py-1 disabled:opacity-50"
        />
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={isLoading}
          className="px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <Button
        variant="danger"
        size="sm"
        onClick={onRemove}
        disabled={isLoading}
        className="self-center"
      >
        Remove
      </Button>
    </div>
  );
};

export default CartItem;
