import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VideoService } from "../services/video.services.js";
import { CommentService } from "../services/comment.services.js";
import { SubscriptionService } from "../services/subscription.services.js";
import { notificationService } from "@Shared/services/notification.services.js";
import { videoQueryKeys } from "../constants/queryKeys.js";

export const useUploadVideo = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: VideoService.update,

      onMutate: async (newVideo) => {
         await queryClient.cancelQueries({ queryKey: videoQueryKeys.list() });

         const previousVideos = queryClient.getQueryData(videoQueryKeys.list());

         if (previousVideos?.pages) {
            queryClient.setQueryData(videoQueryKeys.list(), (old) => {
               if (!old?.pages) return old;
               
               // Add to the first page
               const newPages = [...old.pages];
               if (newPages[0]) {
                  newPages[0] = [
                     { ...newVideo, _id: "temp-id", createdAt: new Date().toISOString() },
                     ...newPages[0],
                  ];
               }
               
               return {
                  ...old,
                  pages: newPages,
               };
            });
         }

         return { previousVideos };
      },

      onSuccess: (uploadedVideo) => {
         queryClient.setQueryData(videoQueryKeys.list(), (old) => {
            if (!old?.pages) return old;

            return {
               ...old,
               pages: old.pages.map((page) =>
                  page.map((video) =>
                     video._id === "temp-id" ? uploadedVideo : video
                  )
               ),
            };
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
      mutationFn: VideoService.delete(videoId),

      onMutate: async (videoId) => {
         await queryClient.cancelQueries({ queryKey: videoQueryKeys.list() });

         const previousVideos = queryClient.getQueryData(videoQueryKeys.list());

         if (previousVideos?.pages) {
            queryClient.setQueryData(videoQueryKeys.list(), (old) => {
               if (!old?.pages) return old;
               
               return {
                  ...old,
                  pages: old.pages.map((page) =>
                     page.filter((video) => video._id !== videoId)
                  ),
               };
            });
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
      mutationFn: (data) =>  { 
         // console.log("useVideoMutations - useUpdateVideo - mutationFn called with:", data);
         return VideoService.update(data) },
      retry: false,
      onMutate: async ({ videoId, updatedData }) => {
         await queryClient.cancelQueries({ queryKey: videoQueryKeys.list() });
         const previousVideos = queryClient.getQueryData(videoQueryKeys.list());
         // console.log("Updating video:", { videoId, updatedData });
         
         if (previousVideos?.pages) {
            // console.log("Previous videos found, updating cache optimistically");
            queryClient.setQueryData(videoQueryKeys.list(), (old) => {
               if (!old?.pages) return old;
               
               // console.log("Old videos in cache:", old.pages);
               
               return {
                  ...old,
                  pages: old.pages.map((page) => 
                     page.map((video) => 
                        video._id === videoId ? { ...video, ...updatedData } : video
                     )
                  ),
               };
            });
         }
         return { previousVideos };
      },
      onSuccess: () => {
         notificationService.success("Video updated successfully");
      },
      onError: (error, _, context) => {
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

export const useAddComment = (videoId) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (newComment) => CommentService.addComment(newComment),
      retry: false,
      onMutate: async (newComment) => {
         await queryClient.cancelQueries({ queryKey: videoQueryKeys.comments(videoId) });
         const previousComments = queryClient.getQueryData(videoQueryKeys.comments(videoId));
         queryClient.setQueryData(videoQueryKeys.comments(videoId), (old) => {
            if (!old) return old;

            const optimisticComment = {
               _id: 'temp-' + Date.now(),
               content: newComment.content,
               user: {
                  _id: newComment.userId,
                  username: 'You',
                  avatar: ''
               },
               likes: 0,
               createdAt: 'Just now',
            };

            return {
               ...old,
               comments: [optimisticComment, ...(old.comments || [])],
               totalComments: (old.totalComments || 0) + 1
            };
         });

         return { previousComments };
      },
      onError: (err, newComment, context) => {
         if (context?.previousComments) {
            queryClient.setQueryData(videoQueryKeys.comments(videoId), context.previousComments);
         }
         notificationService.error("Failed to add comment");
      },
      onSuccess: () => {
         notificationService.success("Comment added successfully");
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: videoQueryKeys.comments(videoId) });
      }
   });
}

export const useToggleVideoLike = (videoId) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ type }) => VideoService.toggleVideoLike(videoId, type),
      retry: false,
      onMutate: async ({ type }) => {
         // Cancel any outgoing refetches
         await queryClient.cancelQueries({ queryKey: videoQueryKeys.detail(videoId) });

         // Snapshot the previous value
         const previousVideo = queryClient.getQueryData(videoQueryKeys.detail(videoId));

         // Optimistically update the cache
         queryClient.setQueryData(videoQueryKeys.detail(videoId), (old) => {
            if (!old) return old;

            const currentIsLiked = old.userInteration?.isLiked;
            const currentIsDisliked = old.userInteration?.isDisliked;

            let newLikes = old.likes || 0;
            let newIsLiked = false;
            let newIsDisliked = false;

            if (type === 'like') {
               if (currentIsLiked) {
                  // Removing like
                  newLikes -= 1;
               } else if (currentIsDisliked) {
                  // Changing from dislike to like
                  newLikes += 1;
                  newIsLiked = true;
               } else {
                  // Adding like
                  newLikes += 1;
                  newIsLiked = true;
               }
            } else if (type === 'dislike') {
               if (currentIsDisliked) {
                  // Removing dislike (no change to like count)
               } else if (currentIsLiked) {
                  // Changing from like to dislike
                  newLikes -= 1;
                  newIsDisliked = true;
               } else {
                  // Adding dislike (no change to like count)
                  newIsDisliked = true;
               }
            }

            return {
               ...old,
               likes: newLikes,
               userInteration: {
                  ...old.userInteration,
                  isLiked: newIsLiked,
                  isDisliked: newIsDisliked,
               }
            };
         });

         return { previousVideo };
      },
      onError: (err, variables, context) => {
         // Rollback to previous value on error
         if (context?.previousVideo) {
            queryClient.setQueryData(videoQueryKeys.detail(videoId), context.previousVideo);
         }
      },
      onSettled: () => {
         // Refetch to ensure we have the correct data
         queryClient.invalidateQueries({ queryKey: videoQueryKeys.detail(videoId) });
      }
   });
}

export const useLikeComment = (videoId) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (commentId) => CommentService.toggleCommentLike(commentId),
      retry: false, // Don't retry toggle operations
      onMutate: async (commentId) => {
         // Cancel any outgoing refetches
         await queryClient.cancelQueries({ queryKey: videoQueryKeys.comments(videoId) });

         // Snapshot the previous value
         const previousComments = queryClient.getQueryData(videoQueryKeys.comments(videoId));

         // Optimistically update the cache
         queryClient.setQueryData(videoQueryKeys.comments(videoId), (old) => {
            if (!old?.comments) return old;

            return {
               ...old,
               comments: old.comments.map(comment =>
                  comment._id === commentId
                     ? { ...comment, likes: comment.likes + 1 }
                     : comment
               )
            };
         });

         return { previousComments };
      },
      onError: (err, commentId, context) => {
         // Rollback to previous value on error
         if (context?.previousComments) {
            queryClient.setQueryData(videoQueryKeys.comments(videoId), context.previousComments);
         }
      },
      onSettled: () => {
         // Refetch to ensure we have the correct data
         queryClient.invalidateQueries({ queryKey: videoQueryKeys.comments(videoId) });
      }
   });
}

export const useToggleSubscription = (videoId) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (channelId) => SubscriptionService.toggleSubscription(channelId),
      retry: false,
      onMutate: async (channelId) => {
         // Cancel any outgoing refetches
         await queryClient.cancelQueries({ queryKey: videoQueryKeys.detail(videoId) });

         // Snapshot the previous value
         const previousVideo = queryClient.getQueryData(videoQueryKeys.detail(videoId));

         // Optimistically update the cache
         queryClient.setQueryData(videoQueryKeys.detail(videoId), (old) => {
            if (!old) return old;

            const currentIsSubscribed = old.owner?.isSubscribed || old.userInteration?.isSubscribed;
            const currentSubscribers = old.owner?.subscribers || 0;

            return {
               ...old,
               owner: {
                  ...old.owner,
                  subscribers: currentIsSubscribed ? currentSubscribers - 1 : currentSubscribers + 1,
               },
               userInteration: {
                  ...old.userInteration,
                  isSubscribed: !currentIsSubscribed,
               }
            };
         });

         return { previousVideo };
      },
      onError: (err, channelId, context) => {
         // Rollback to previous value on error
         if (context?.previousVideo) {
            queryClient.setQueryData(videoQueryKeys.detail(videoId), context.previousVideo);
         }
         notificationService.error("Failed to toggle subscription");
      },
      onSettled: () => {
         // Refetch to ensure we have the correct data
         queryClient.invalidateQueries({ queryKey: videoQueryKeys.detail(videoId) });
      }
   });
}

// export const useVideoCommentsOperations = () => {
//    const queryClient = useQueryClient();
//    // Similar structure can be followed for comments operations
//    return {
//       addComment: (data) => useAddComment(data),
//       // deleteComment: deleteCommentMutation,
//       // isAdding: addCommentMutation.isLoading,
//       // isDeleting: deleteCommentMutation.isLoading,
//       // addError: addCommentMutation.error,
//       // deleteError: deleteCommentMutation.error,
//       refetchComments: (videoId) => {
//          queryClient.invalidateQueries({ queryKey: videoQueryKeys.comments(videoId) });
//       },
//    };
// }

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
