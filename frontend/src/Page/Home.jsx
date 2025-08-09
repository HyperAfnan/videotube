import { lazy, useEffect, useState, Suspense } from "react";
import { secureFetch } from "../utils/secureFetch.js";
const VideoCard = lazy(() => import("../Components/Video/Home/VideoCard.jsx"));
import { useSelector } from "react-redux";
import SkeletonVideoCard from "../Components/Video/Home/SkeletonVideoCard.jsx";

export default function Home() {
   let page = 1;
   const [video, setVideos] = useState([]);
   const { accessToken } = useSelector((state) => state.auth);

   const fetchData = async () => {
      try {
         const videoResponse = await secureFetch(
            `/api/v1/videos?page=${page}`,
            {},
            accessToken,
         );
         setVideos(videoResponse.data.videos);
         if (!videoResponse.success) throw new Error("Failed to fetch videos");
      } catch (error) {
         console.error("Error fetching data:", error);
      }
   };

   useEffect(() => {
      fetchData();

      const scrollHandler = async () => {
         const scrollHeight = document.documentElement.scrollHeight;
         const scrollTop = document.documentElement.scrollTop;
         const innerHeight = window.innerHeight;
         try {
            if (scrollTop + innerHeight >= scrollHeight - 100) {
               page++;
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
               } else {
                  console.error("Failed to fetch more videos");
               }
            }
         } catch (error) {
            throw new Error("Error in scrollHandler: " + error.message);
         }
      };
      window.addEventListener("scroll", scrollHandler);
   }, []);

   return (
      <div className="flex items-center flex-col md:flex-row justify-center flex-wrap overflow-x-clip">
         <Suspense fallback={<SkeletonVideoCard count={12} />}>
            {video.map((video) => (
               <VideoCard
                  key={video._id}
                  videoId={video._id}
                  title={video.title}
                  thumbnail={video.thumbnail}
                  views={video.views}
                  uploadedAt={video.createdAt}
                  owner={video.owner}
               />
            ))}
         </Suspense>
      </div>
   );
}
