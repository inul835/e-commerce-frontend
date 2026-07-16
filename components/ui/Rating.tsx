import React from 'react';

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  };

  const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <div className={`flex gap-1 ${className}`}>
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => interactive && onChange?.(star)}
          disabled={!interactive}
          className={`${sizeClasses[size]} transition-colors ${
            star <= Math.round(rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-300' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-gray-600 text-sm">
        {rating.toFixed(1)} / {maxRating}
      </span>
    </div>
  );
};

export default Rating;
