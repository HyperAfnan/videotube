import { Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { lazy, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
const VideoCardMenu = lazy(() => import("./VideoCardMenu.jsx"));
import { getWebpThumbnail, timeAgo } from "@Shared/utils/formatter.js";
import { useVideo } from "../hook/useVideo.js";

const LazyImage = ({ src, alt, className }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  return (
    <img
      ref={ref}
      src={inView ? src : undefined}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${
        inView ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};

const VideoCard = ({ thumbnail, title, uploadedAt, views, videoId, video }) => {
  const { fetchOwner } = useVideo();
  const [ownerData, setOwnerData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (video?.owner) {
        const data = await fetchOwner(video.owner);
        setOwnerData(data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col space-y-4 w-[435px] h-[350px] mx-2 my-2 hover:bg-gray-100 rounded-xl p-2">
      {/* Thumbnail */}
      <Link to={`/watch/${videoId}`}>
        <LazyImage
          src={getWebpThumbnail(thumbnail)}
          alt="Video Thumbnail"
          className="w-[435px] h-[245px] object-cover rounded-xl"
        />
      </Link>

      <div className="flex flex-row space-x-2">
        {/* Owner PFP */}
        <Link to={`/user/${ownerData?.username}`} className="flex-shrink-0">
          <LazyImage
            src={ownerData?.avatar}
            alt={ownerData?.username}
            className="w-10 h-10 rounded-full"
          />
        </Link>

        <div className="flex flex-col cursor-pointer w-full">
          {/* Title and Owner */}
          <Link to={`/watch/${videoId}`}>
            <span className="text-base font-semibold">{title}</span>
          </Link>
          <Link to={`/user/${ownerData?.username}`}>
            <span className="text-sm text-gray-600 hover:text-black">
              {ownerData?.username}
            </span>
          </Link>

          {/* Views and Uploaded At */}
          <div className="flex items-center space-x-1 w-full">
            <div className="flex min-w-[175px]">
              <span className="text-sm text-gray-600">{views} views</span>
              <Dot className="text-gray-600" />
              <span className="text-sm text-gray-600">
                {timeAgo(uploadedAt)}
              </span>
            </div>
            {/* Ellipsis Menu */}
            <VideoCardMenu videoId={videoId} videoTitle={title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
