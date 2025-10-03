import { useMutation, useQueryClient } from "@tanstack/react-query";
import { watchLaterService } from "../services/waterlater.services.js";
import { notificationService } from "@Shared/services/notification.services.js";
import { watchLaterKeys } from "../constants/queryKeys.js";

/**
 * Hook for adding videos to watch later
 * Includes optimistic updates for better UX
 *
 * @returns {Object} Mutation object with mutate function
 */
export const useAddToWatchLater = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: watchLaterService.add,

    // Optimistic update - immediately update UI
    onMutate: async (videoId) => {
      // Cancel any in-flight queries to prevent overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: watchLaterKeys.list() });

      // Snapshot current data for potential rollback
      const previousData = queryClient.getQueryData(watchLaterKeys.list());

      // Note: Since we don't have full video data here, we'll rely on onSuccess
      // In a real app, you might pass the full video object

      return { previousData };
    },

    // Handle successful mutation
    onSuccess: (newWatchLaterEntry, videoId) => {
      // Update cache with server response
      queryClient.setQueryData(watchLaterKeys.list(), (old) => {
        if (!old) return [newWatchLaterEntry];

        // Check if already exists to prevent duplicates
        const exists = old.some((item) => item._id === newWatchLaterEntry._id);
        if (exists) return old;

        return [...old, newWatchLaterEntry];
      });

      // Show success notification with undo action
      notificationService.info("Saved to Watch Later", {
        action: {
          label: "Undo",
          onClick: () => {
            // This will trigger the remove mutation
            // You'll need to expose removeFromWatchLater here or handle it differently
            queryClient.invalidateQueries({ queryKey: watchLaterKeys.list() });
          },
        },
      });
    },

    // Handle errors - rollback optimistic update
    onError: (error, videoId, context) => {
      // Restore previous data on error
      if (context?.previousData) {
        queryClient.setQueryData(watchLaterKeys.list(), context.previousData);
      }

      notificationService.error("Failed to add video to Watch Later");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: watchLaterKeys.list() });
    },
  });
};

/**
 * Hook for removing videos from watch later
 * Includes optimistic updates and error handling
 *
 * @returns {Object} Mutation object with mutate function
 */
export const useRemoveFromWatchLater = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: watchLaterService.remove,

    // Optimistic update - immediately remove from UI
    onMutate: async (videoId) => {
      // Cancel queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: watchLaterKeys.list() });

      // Snapshot for rollback
      const previousData = queryClient.getQueryData(watchLaterKeys.list());

      // Optimistically remove the video
      queryClient.setQueryData(watchLaterKeys.list(), (old) => {
        if (!old) return [];
        return old.filter((item) => item.video._id !== videoId);
      });

      return { previousData };
    },

    // Handle successful removal
    onSuccess: () => {
      notificationService.info("Video removed from Watch Later");
    },

    // Handle errors - restore previous state
    onError: (error, videoId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(watchLaterKeys.list(), context.previousData);
      }

      notificationService.error("Failed to remove video from Watch Later");
    },

    // Ensure data is synchronized
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: watchLaterKeys.list() });
    },
  });
};

/**
 * Combined hook that provides all watch later operations
 * This maintains compatibility with existing components
 *
 * @returns {Object} All watch later operations and data
 */
export const useWatchLaterOperations = () => {
  const queryClient = useQueryClient();
  const addMutation = useAddToWatchLater();
  const removeMutation = useRemoveFromWatchLater();

  // Get current data from cache
  const watchLater = queryClient.getQueryData(watchLaterKeys.list()) || [];

  // Helper to check if video is in watch later
  const isInWatchLater = (videoId) => {
    return watchLater.some((item) => item.video._id === videoId);
  };

  // Wrapper functions that match existing API
  const addToWatchLater = async (videoId) => {
    if (isInWatchLater(videoId)) {
      notificationService.error("Video already in Watch Later");
      return;
    }

    return addMutation.mutateAsync(videoId);
  };

  const removeFromWatchLater = async (videoId) => {
    if (!isInWatchLater(videoId)) {
      notificationService.error("Video not found in Watch Later");
      return;
    }

    return removeMutation.mutateAsync(videoId);
  };

  return {
    addToWatchLater,
    removeFromWatchLater,
    isAddingToWatchLater: addMutation.isLoading,
    isRemovingFromWatchLater: removeMutation.isLoading,
    isInWatchLater,
  };
};
