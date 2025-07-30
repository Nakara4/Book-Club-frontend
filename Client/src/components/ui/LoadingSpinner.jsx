import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  text = '', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    accent: 'border-accent-600',
    neutral: 'border-neutral-600',
    white: 'border-white'
  };

  const spinnerElement = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div 
          className={`animate-spin rounded-full border-4 border-neutral-200 dark:border-neutral-700 ${sizeClasses[size]}`}
        />
        <div 
          className={`absolute top-0 left-0 animate-spin rounded-full border-4 border-t-transparent ${colorClasses[color]} ${sizeClasses[size]}`}
        />
      </div>
      {text && (
        <p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerElement}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {spinnerElement}
    </div>
  );
};

export default LoadingSpinner;
