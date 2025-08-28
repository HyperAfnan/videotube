import { useEffect, Suspense, lazy } from "react";
import SkeletonVideoCard from "@Features/video/components/SkeletonVideoCard.jsx";
const VideoCard = lazy(
  () => import("@Features/video/components/VideoCard.jsx"),
);
import Container from "@Shared/components/Container.jsx";
import { useVideos } from "@Features/video/hook/useVideoQueries.js";
import { useInView } from "react-intersection-observer";

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
    if (inView && hasNextPage && !isFetchingNextPage) { fetchNextPage(); }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) return <div>Error: {error.message || error}</div>;

  return (
    <Container>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
        <div ref={ref} />
        {isFetchingNextPage && <SkeletonVideoCard count={6} />}
      </div>
    </Container>
  );
}
