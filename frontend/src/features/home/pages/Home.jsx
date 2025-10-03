import { useEffect, Suspense, lazy } from "react";
import ShadcnSkeletonVideoCard from "@Features/video/components/ShadcnSkeletonVideoCard.jsx";
import Container from "@Shared/components/DarkModeContainer.jsx";
import { useVideos } from "@Features/video/hook/useVideoQueries.js";
import { useInView } from "react-intersection-observer";
import { Button } from "@Shared/components/ui/button.jsx";
import { MoonIcon, SunIcon } from "lucide-react";
import { useThemeRedux } from "@Features/theme/hook/useThemeRedux.js";

const VideoCard = lazy(
  () => import("@Features/video/components/ShadcnVideoCard.jsx"),
);

export default function Home() {
  const { ref, inView } = useInView();
  const { theme, toggleTheme } = useThemeRedux();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error, isLoading } = useVideos();
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
      <div className="w-full flex justify-end mb-4 mr-6">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-700"
        >
          {theme === "dark" ? (
            <SunIcon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors duration-300 dark:text-zinc-100">
        <Suspense fallback={<ShadcnSkeletonVideoCard count={12} />}>
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
          {isLoading && <ShadcnSkeletonVideoCard count={12} />}
        </Suspense>
        <div ref={ref} className="h-4 w-full" />
        {isFetchingNextPage && (
          <div className="col-span-full py-4">
            <div className="flex justify-center items-center gap-4">
              <div className="h-2 w-2 bg-gray-400 dark:bg-zinc-600 rounded-full animate-pulse"></div>
              <div className="h-2 w-2 bg-gray-400 dark:bg-zinc-600 rounded-full animate-pulse delay-150"></div>
              <div className="h-2 w-2 bg-gray-400 dark:bg-zinc-600 rounded-full animate-pulse delay-300"></div>
            </div>
            <ShadcnSkeletonVideoCard count={6} />
          </div>
        )}
      </div>
    </Container>
  );
}
