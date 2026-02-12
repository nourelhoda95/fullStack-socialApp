import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md', 
  online,
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 dark:border-gray-700`}
      />
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ${
            size === 'xs' ? 'w-2 h-2' : 'w-3 h-3'
          } ${online ? 'bg-green-500' : 'bg-gray-400'} ring-2 ring-white dark:ring-gray-800`}
        />
      )}
    </div>
  );
};
