import React from 'react';

interface LoaderProps {
  type?: 'spinner' | 'dots' | 'bars';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  type = 'spinner',
  size = 'md',
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const loaderContent = (
    <div className="flex flex-col items-center gap-3">
      {type === 'spinner' && (
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
      )}

      {type === 'dots' && (
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {type === 'bars' && (
        <div className="flex gap-1 items-end">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 bg-blue-600 rounded-full"
              style={{
                height: `${12 + i * 6}px`,
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return <div className={`flex justify-center items-center py-8 ${className}`}>{loaderContent}</div>;
};

export default Loader;
