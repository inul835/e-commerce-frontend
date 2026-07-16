'use client';

import React from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface OrderItemProps {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  itemCount: number;
  onViewDetails?: () => void;
}

const OrderItem: React.FC<OrderItemProps> = ({
  id,
  orderNumber,
  date,
  status,
  total,
  itemCount,
  onViewDetails,
}) => {
  const statusColors = {
    pending: 'warning',
    processing: 'gray',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  } as const;

  const statusLabels = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">Order #{orderNumber}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <Badge variant={statusColors[status]}>{statusLabels[status]}</Badge>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </p>
          <p className="text-lg font-bold text-gray-900">${total.toFixed(2)}</p>
        </div>
        {onViewDetails && (
          <Button variant="secondary" size="sm" onClick={onViewDetails}>
            View Details
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
