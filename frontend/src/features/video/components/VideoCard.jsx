import { Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoCardMenu from "./VideoCardMenu.jsx";
import { asyncHandler, secureFetch , timeAgo} from "@Utils";

const VideoCard = ({ thumbnail, title, uploadedAt, views, owner, videoId }) => {
  function getWebpThumbnail(thumbnail) {
    if (thumbnail.endsWith(".webp")) return thumbnail;
    return thumbnail.replace(/\.jpg$/, ".webp").replace(/\.png$/, ".webp");
  }
  const [ownerData, setOwnerData] = useState([]);
  const fetchOwnerData = asyncHandler(async () => {
    const response = await secureFetch(`/api/v1/user/${owner}`);

    if (response.success) setOwnerData(response.data);
    else console.error("Failed to fetch owner data");
  });

  useEffect(() => {
    fetchOwnerData();
  }, []);

  return (
    <div className="flex flex-col space-y-4 w-[435px] h-[350px] mx-2 my-2  hover:bg-gray-100 rounded-xl p-2 ">
      {/*          Thumbnail */}

      {/*          TODO: make the duration show on the thumbnail bottom right */}
      {/*          TODO: hover should play video */}

      <Link to={`/watch/${videoId}`}>
        <img
          src={getWebpThumbnail(thumbnail)}
          alt="Video Thumbnail"
          className="w-[435px] h-[245px] object-cover rounded-xl"
        />
      </Link>
      <div className="flex flex-row space-x-2">
        {/*          Owner PFP */}
        <Link to={`/user/${ownerData.username}`} className="flex-shrink-0">
          <img
            className="w-10 h-10 rounded-full"
            src={ownerData?.avatar}
            alt={ownerData?.username}
          />
        </Link>
        <div className="flex flex-col cursor-pointer w-full">
          {/*          Title and Owner */}
          <Link to={`/watch/${videoId}`}>
            <span className="text-md font-semibold">{title}</span>
          </Link>
          <Link to={`/user/${ownerData.username}`}>
            <span className="text-sm text-gray-600 hover:text-black">
              {ownerData?.username}
            </span>
          </Link>
          {/*          Views and Uploaded At */}
          <div className="flex items-center space-x-1 w-full">
            <div className="flex min-w-[175px]">
              <span className="text-sm text-gray-600">{views} views</span>
              <Dot className="text-gray-600" />
              <span className="text-sm text-gray-600">
                {timeAgo(uploadedAt)}
              </span>
            </div>
            {/*          Ellipsis Menu */}
            <VideoCardMenu videoId={videoId} videoTitle={title} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
