import { useQuery , useInfiniteQuery } from "@tanstack/react-query";
import { VideoService } from "../services/video.services.js";
import { CommentService } from "../services/comment.services.js";
import { SubscriptionService } from "../services/subscription.services.js";
import { videoQueryKeys } from "../constants/queryKeys.js";

export const useVideos = (options = {}) => {
   return useInfiniteQuery({
      queryKey: videoQueryKeys.list(),
      queryFn: ({ pageParam = 1 }) => VideoService.getVideos(pageParam) || [],
      getNextPageParam: (lastPage, allPages) => {
         console.log(lastPage, allPages);
         if (lastPage?.length === 0) return undefined;
         return allPages?.length + 1;
      },
      initialPageParam: 1,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: true,
      retry: 2,
      ...options,
   });
}

export const useVideoById = (videoId, options = {}) => {
  return useQuery({
    queryKey: videoQueryKeys.detail(videoId),
    queryFn: () => VideoService.fetchById(videoId),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
};

export const useVideoComments = (videoId, options = {}) => {
  return useQuery({
    queryKey: videoQueryKeys.comments(videoId),
    queryFn: () => CommentService.getVideoComments(videoId),
    enabled: !!videoId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
}

// export const useVideoOwner = (ownerId, options = {}) => {
//   return useQuery({
//     queryKey: ['owners', ownerId],
//     queryFn: () => videoService.fetchOwner(ownerId),
//     enabled: !!ownerId,
//     staleTime: 10 * 60 * 1000,
//     cacheTime: 20 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     retry: 2,
//     ...options,
//   });
// };

export const useVideo = (videoId, options = {}) => {
  const videoQuery = useVideoById(videoId, options);
  // const ownerId = videoQuery.data?.owner?._id;
  // const ownerQuery = useVideoOwner(ownerId, {
  //   enabled: !!ownerId,
  //   ...options,
  // });

  return {
    // video: videoQuery.data || null,
    // // owner: ownerQuery.data || null,
    // isLoading: videoQuery.isLoading /* || ownerQuery.isLoading */,
    // error: videoQuery.error?.message /* || ownerQuery.error?.message */ || null,
    // isFetching: videoQuery.isFetching /* || ownerQuery.isFetching */,
    // refetch: () => {
    //   videoQuery.refetch();
    //   // ownerQuery.refetch();
    // },
      ...videoQuery,
  };
};

export const useChannelSubscribers = (channelId, options = {}) => {
  return useQuery({
    queryKey: videoQueryKeys.subscribers(channelId),
    queryFn: () => SubscriptionService.getChannelSubscribers(channelId),
    enabled: !!channelId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
};

export const useSubscribedChannels = (userId, options = {}) => {
  return useQuery({
    queryKey: videoQueryKeys.subscriptions(userId),
    queryFn: () => SubscriptionService.getSubscribedChannels(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
};
