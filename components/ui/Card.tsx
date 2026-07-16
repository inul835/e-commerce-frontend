import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = '', children }) => (
  <div
    className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}
  >
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
);

const CardBody: React.FC<CardBodyProps> = ({ className = '', children }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const CardFooter: React.FC<CardFooterProps> = ({ className = '', children }) => (
  <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
