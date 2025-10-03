import { useQuery } from '@tanstack/react-query';
import { watchLaterService } from '../services/waterlater.services.js';
import { watchLaterKeys } from '../constants/queryKeys.js';

/**
 * Custom hook for fetching watch later videos
 * Handles caching, background refetching, and error states automatically
 * 
 * @param {Object} options - Additional query options
 * @returns {Object} Query result with data, loading, and error states
 */
export const useWatchLaterVideos = (options = {}) => {
  return useQuery({
    queryKey: watchLaterKeys.list(),
    queryFn: watchLaterService.fetchAll,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    ...options,
  });
};

export const useWatchLater = () => {
  const query = useWatchLaterVideos();
  
  const isInWatchLater = (videoId) => {
    return query.data?.some((watchlater) => watchlater.video._id === videoId) || false;
  };

  return {
    watchLater: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    isFetching: query.isFetching,
    refetch: query.refetch,
    isInWatchLater,
  };
};
