const ShadcnSkeletonVideoCard = ({ count = 1 }) => {
  return Array(count)
    .fill()
    .map((_, index) => (
      <div
        key={index}
        className="overflow-hidden border-none shadow-none bg-transparent"
      >
        <div className="aspect-video relative overflow-hidden rounded-xl">
          <div className="w-full h-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
        </div>
        <div className="p-3">
          <div className="flex gap-3">
            {/* Channel Avatar Skeleton */}
            <div className="flex-shrink-0 mt-1">
              <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
            </div>

            <div className="flex-1">
              {/* Title Skeleton */}
              <div className="h-5 w-4/5 mb-2 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />
              <div className="h-4 w-3/5 mb-1 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />

              {/* Meta Skeleton */}
              <div className="flex gap-2">
                <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded" />
              </div>
            </div>

            {/* Action Button Skeleton */}
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-800 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    ));
};

export default ShadcnSkeletonVideoCard;
