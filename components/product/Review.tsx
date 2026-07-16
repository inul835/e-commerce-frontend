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
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="border-b border-gray-200 py-6 last:border-b-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {author.avatar && (
            <Image
              src={author.avatar}
              alt={author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-gray-900">{author.name}</p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
        </div>

        {canEditDelete && (
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Rating and Title */}
      <div className="mb-2">
        <Rating rating={rating} size="sm" />
        <h3 className="text-base font-semibold text-gray-900 mt-2">{title}</h3>
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">{comment}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMarkHelpful}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
              isHelpful
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            👍 Helpful ({helpfulCount})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
