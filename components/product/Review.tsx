'use client';

import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import Rating from '../ui/Rating';
import Badge from '../ui/Badge';

interface ReviewProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  comment: string;
  helpfulCount: number;
  createdAt: string;
  isHelpful?: boolean;
  onMarkHelpful?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  canEditDelete?: boolean;
}

const Review: React.FC<ReviewProps> = ({
  id,
  author,
  rating,
  title,
  comment,
  helpfulCount,
  createdAt,
  isHelpful = false,
  onMarkHelpful,
  onEdit,
  onDelete,
  canEditDelete = false,
}) => {
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="border-b border-gray-200/60 py-6 last:border-b-0 font-sans antialiased bg-white">
      {/* 👤 Author Info - Amazon Profile Style */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-gray-400">👤</span>
            )}
          </div>
          <span className="text-sm font-medium text-gray-950">{author.name}</span>
        </div>

        {/* Action Controls */}
        {canEditDelete && (
          <div className="flex gap-1.5">
            {onEdit && (
              <button onClick={onEdit} className="text-xs font-semibold text-gray-400 hover:text-gray-900 transition-colors">
                Edit
              </button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors">
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* ⭐ Rating & Dynamic Title Block */}
      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <Rating rating={rating} size="sm" />
        <h3 className="text-sm font-bold text-gray-950 tracking-tight">{title}</h3>
      </div>

      {/* 📅 Date & Trust Badge */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500 mb-2.5">
        <span>Reviewed in the United States on {date}</span>
        <span className="text-gray-300">|</span>
        <span className="font-extrabold text-[#c45500] text-[11px]">Verified Purchase</span>
      </div>

      {/* 💬 Review Comment Body */}
      <p className="text-sm text-gray-800 mb-4 leading-relaxed max-w-3xl font-normal">
        {comment}
      </p>

      {/* 🛠️ Modern Minimalist Helpful Action Button */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {helpfulCount > 0 && (
          <p className="font-medium text-gray-500">
            {helpfulCount} {helpfulCount === 1 ? 'person' : 'people'} found this helpful
          </p>
        )}
        
        <button
          onClick={onMarkHelpful}
          className={`px-6 py-1.5 rounded-xl text-xs font-semibold shadow-sm border transition-all active:scale-[0.98] ${
            isHelpful
              ? 'bg-amber-50 border-amber-400/60 text-amber-800 ring-2 ring-amber-500/10'
              : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {isHelpful ? '✓ Helpful' : 'Helpful'}
        </button>
      </div>
    </div>
  );
};

export default Review;