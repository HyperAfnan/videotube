import { lazy, useEffect, useState, Suspense } from "react";
import { secureFetch, asyncHandler } from "../utils/index.js";
const VideoCard = lazy(() => import("../Components/Video/Home/VideoCard.jsx"));
import { useSelector } from "react-redux";
import SkeletonVideoCard from "../Components/Video/Home/SkeletonVideoCard.jsx";

export default function Home() {
  const [page, setPage] = useState(1);
  const [video, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useSelector((state) => state.auth);

  const fetchInitialVideos = asyncHandler(async () => {
    const videoResponse = await secureFetch(
      `/api/v1/videos?page=${page}`,
      {},
      accessToken,
    );
    setVideos(videoResponse.data.videos);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);

    if (!videoResponse.success) throw new Error("Failed to fetch videos");
  });

  const scrollHandler = asyncHandler(async () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const innerHeight = window.innerHeight;
    if (scrollTop + innerHeight >= scrollHeight - 100) {
      const videoResponse = await secureFetch(
        `/api/v1/videos?page=${page}`,
        {},
        accessToken,
      );
      if (videoResponse.success) {
        setVideos((prevVideos) => [
          ...prevVideos,
          ...videoResponse.data.videos,
        ]);
        setPage((prevPage) => prevPage + 1);
        setLoading(true);
      } else {
        console.error("Failed to fetch more videos");
      }
    }
  });

  useEffect(() => {
    fetchInitialVideos();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return (
    <div className="flex items-center flex-col md:flex-row justify-center flex-wrap overflow-x-clip">
      <Suspense fallback={<SkeletonVideoCard count={12} />}>
        {video.map((video, index) => (
          <VideoCard
            key={index}
            videoId={video._id}
            title={video.title}
            thumbnail={video.thumbnail}
            views={video.views}
            uploadedAt={video.createdAt}
            owner={video.owner}
          />
        ))}
        {loading && <SkeletonVideoCard count={12} />}
      </Suspense>
    </div>
  );
}
