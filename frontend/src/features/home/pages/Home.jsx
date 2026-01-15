import { useEffect, Suspense, lazy } from "react";
import SkeletonVideoCard from "@/features/video/components/SkeletonVideoCard.jsx";
import Container from "@Shared/components/DarkModeContainer.jsx";
import { useVideos } from "@Features/video/hook/useVideoQueries.js";
import { useInView } from "react-intersection-observer";

const VideoCard = lazy(
   () => import("@/features/video/components/VideoCard.jsx"),
);

export default function Home() {
   const { ref, inView } = useInView();
   const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      error,
      isLoading,
   } = useVideos();
   const videos = data?.pages?.flat() || [];

   useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   if (error)
      return (
         <div className="p-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md">
            Error: {error.message || error}
         </div>
      );

   return (
      <Container className="dark:bg-zinc-900 transition-all duration-300">
         <div className="w-full flex justify-end mb-4 mr-6"></div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors duration-300 dark:text-zinc-100">
            <Suspense fallback={<SkeletonVideoCard count={12} />}>
               {videos.map((video, index) => (
                  <VideoCard
                     key={video?._id || index}
                     videoId={video?._id}
                     title={video?.title}
                     thumbnail={video?.thumbnail}
                     views={video?.views}
                     uploadedAt={video?.createdAt}
                     owner={video?.owner}
                  />
               ))}
               {isLoading && <SkeletonVideoCard count={12} />}
            </Suspense>
            <div ref={ref} className="h-4 w-full" />
            {isFetchingNextPage && (
               <div className="col-span-full py-4">
                  <div className="flex justify-center items-center gap-4">
                     <div className="h-2 w-2 bg-gray-400 dark:bg-zinc-600 rounded-full animate-pulse"></div>
                     <div className="h-2 w-2 bg-gray-400 dark:bg-zinc-600 rounded-full animate-pulse delay-150"></div>
                     <div className="h-2 w-2 bg-gray-400 dark:bg-zinc-600 rounded-full animate-pulse delay-300"></div>
                  </div>
                  <SkeletonVideoCard count={6} />
               </div>
            )}
         </div>
      </Container>
   );
}
