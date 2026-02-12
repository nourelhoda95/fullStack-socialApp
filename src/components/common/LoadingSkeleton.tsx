import React from 'react';

interface LoadingSkeletonProps {
  type?: 'post' | 'user' | 'comment';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'post', 
  count = 1 
}) => {
  const PostSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
      </div>
      <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4" />
      <div className="flex gap-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20" />
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20" />
      </div>
    </div>
  );

  const UserSkeleton = () => (
    <div className="flex items-center gap-3 p-4 animate-pulse">
      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24" />
      </div>
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20" />
    </div>
  );

  const CommentSkeleton = () => (
    <div className="flex gap-3 p-4 animate-pulse">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
      <div className="flex-1">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
      </div>
    </div>
  );

  const skeletonMap = {
    post: PostSkeleton,
    user: UserSkeleton,
    comment: CommentSkeleton,
  };

  const SkeletonComponent = skeletonMap[type];

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </>
  );
};
