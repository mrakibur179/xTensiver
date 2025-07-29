export const PostCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-1/2"></div>
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
