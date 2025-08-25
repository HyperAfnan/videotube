import { useQuery , useInfiniteQuery } from "@tanstack/react-query";
import { VideoService as videoService } from "../services/video.services.js";
import { videoQueryKeys } from "../constants/queryKeys.js";

export const useVideos = (options = {}) => {
   return useInfiniteQuery({
      queryKey: videoQueryKeys.list(),
      queryFn: ({ pageParam = 1 }) => videoService.getVideos(pageParam),
      getNextPageParam: (lastPage, allPages) => {
         if (lastPage.length === 0) return undefined;
         return allPages.length + 1;
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
    queryFn: () => videoService.fetchById(videoId),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    ...options,
  });
};

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
