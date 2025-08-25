import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VideoService as videoService } from "../services/video.services.js";
import { notificationService } from "@Shared/services/notification.services.js";
import { videoQueryKeys } from "../constants/queryKeys.js";

export const useUploadVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: videoService.update,

    onMutate: async (newVideo) => {
      await queryClient.cancelQueries({ queryKey: videoQueryKeys.list() });

      const previousVideos = queryClient.getQueryData(videoQueryKeys.list());

      if (previousVideos) {
        queryClient.setQueryData(videoQueryKeys.list(), (old) => [
          ...old,
          { ...newVideo, _id: "temp-id", createdAt: new Date().toISOString() },
        ]);
      }

      return { previousVideos };
    },

    onSuccess: (uploadedVideo, newVideo) => {
      queryClient.setQueryData(videoQueryKeys.list(), (old) => {
        if (!old) return [uploadedVideo];

        return old.map((video) =>
          video._id === "temp-id" ? uploadedVideo : video,
        );
      });

      notificationService.success("Video uploaded successfully");
    },

    onError: (error, newVideo, context) => {
      if (context?.previousVideos) {
        queryClient.setQueryData(videoQueryKeys.list(), context.previousVideos);
      }
      notificationService.error(
        error.message || "Failed to upload video. Please try again.",
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: videoQueryKeys.list() });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: videoService.delete,

    onMutate: async (videoId) => {
      await queryClient.cancelQueries({ queryKey: videoQueryKeys.list() });

      const previousVideos = queryClient.getQueryData(videoQueryKeys.list());

      if (previousVideos) {
        queryClient.setQueryData(videoQueryKeys.list(), (old) =>
          old.filter((video) => video._id !== videoId),
        );
      }

      return { previousVideos };
    },

    onSuccess: () => {
      notificationService.success("Video deleted successfully");
    },

    onError: (error, videoId, context) => {
      if (context?.previousVideos) {
        queryClient.setQueryData(videoQueryKeys.list(), context.previousVideos);
      }
      notificationService.error(
        error.message || "Failed to delete video. Please try again.",
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: videoQueryKeys.list() });
    },
  });
};

export const useVideoOperations = () => {
  const queryClient = useQueryClient();
  const uploadMutation = useUploadVideo();
  const deleteMutation = useDeleteVideo();
  return {
    uploadVideo: useUploadVideo(),
    deleteVideo: useDeleteVideo(),
    isUploading: uploadMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    uploadError: uploadMutation.error,
    deleteError: deleteMutation.error,
    refetchVideos: () => {
      queryClient.invalidateQueries({ queryKey: videoQueryKeys.list() });
    },
  };
};
