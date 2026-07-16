'use client';

import React from 'react';
import Card, { CardBody, CardFooter } from '../ui/Card';
import Badge from '../ui/Badge';

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  items?: number;
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  tax,
  shipping,
  discount = 0,
  items,
  className = '',
}) => {
  const total = subtotal - discount + tax + shipping;

  return (
    <Card className={className}>
      <CardBody>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

        {items !== undefined && (
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">{items} item(s)</span>
          </div>
        )}

        <div className="space-y-3 border-b border-gray-200 pb-3 mb-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-gray-900">Total</span>
          <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export default OrderSummary;
