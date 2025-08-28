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

      onSuccess: (uploadedVideo) => {
         queryClient.setQueryData(videoQueryKeys.list(), (old) => {
            if (!old) return [uploadedVideo];

            return old.map((video) =>
               video._id === "temp-id" ? uploadedVideo : video,
            );
         });

         notificationService.success("Video uploaded successfully");
      },

      onError: (error, _, context) => {
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

export const useReportVideo = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (videoId) => {
         // const previousVideos = queryClient.getQueryData(videoQueryKeys.list());
         // if (previousVideos) {
         //    queryClient.setQueryData(videoQueryKeys.list(), (old) =>
         //       // old.map((video) => { }),
         //    );
         // }
         // return { previousVideos };
      },

      onSuccess: () => {
         notificationService.info("Video reported successfully");
      },

      onError: (error) => {
         notificationService.error(
            error.message || "Failed to report video. Please try again.",
         );
      },

      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: videoQueryKeys.list() });
      },
   });
};

export const useDeleteVideo = (videoId) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: videoService.delete(videoId),

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

      onError: (error, _, context) => {
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

export const useUpdateVideo = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: videoService.update,
      onMutate: async (videoId, updatedData) => {
         await queryClient.cancelQueries({ queryKey: videoQueryKeys.list() });
         const previousVideos = queryClient.getQueryData(videoQueryKeys.list());
         if (previousVideos) {
            queryClient.setQueryData(videoQueryKeys.list(), (old) =>
               old.map((video) =>
                  video._id === videoId ? { ...video, ...updatedData } : video,
               ),
            );
         }
         return { previousVideos };
      },
      onSuccess: () => {
         notificationService.success("Video updated successfully");
      },
      onError: (error, context) => {
         if (context?.previousVideos) {
            queryClient.setQueryData(videoQueryKeys.list(), context.previousVideos);
         }
         notificationService.error(
            error.message || "Failed to update video. Please try again.",
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
   const reportMutation = useReportVideo();
   const updateMutation = useUpdateVideo();

   return {
      uploadVideo: uploadMutation,
      deleteVideo: deleteMutation,
      reportVideo: reportMutation,
      updateVideo: updateMutation,
      isUploading: uploadMutation.isLoading,
      isDeleting: deleteMutation.isLoading,
      isUpdating: updateMutation.isLoading,
      uploadError: uploadMutation.error,
      deleteError: deleteMutation.error,
      updateError: updateMutation.error,
      refetchVideos: () => {
         queryClient.invalidateQueries({ queryKey: videoQueryKeys.list() });
      },
   };
};
