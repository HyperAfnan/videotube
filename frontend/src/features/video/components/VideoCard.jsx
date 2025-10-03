import {
  EllipsisVertical,
  Clock4,
  ListPlusIcon,
  DownloadIcon,
  BookmarkIcon,
  Share2,
  MessageSquareWarning,
  Dot,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getWebpThumbnail, timeAgo } from "@Shared/utils/formatter.js";
import { Menu } from "@Shared/components/Menu/Menu.jsx";
import { useWatchLaterOperations } from "@Features/watchlater/hook/useWatchLaterMutation.js";
import {
  shareVideo,
  downloadVideo,
} from "@Shared/components/Menu/menuActions.js";
import LazyImage from "@Shared/components/LazyImage.jsx";
import { useReportVideo } from "../hook/useVideoMutations.js";

const VideoCard = ({ thumbnail, title, uploadedAt, views, videoId, owner }) => {
  const { addToWatchLater, isAddingToWatchLater ,} = useWatchLaterOperations();
   const { mutate } = useReportVideo();

  const menuOptions = [
    {
      label: "Add to Queue",
      icon: <ListPlusIcon className="w-4 h-4 inline mr-2" />,
      onClick: () => {
        console.log("Add to Queue clicked");
      },
    },
    {
      label: isAddingToWatchLater
        ? "Saving to watch later"
        : "Save to Watch later",
      icon: <Clock4 className="w-4 h-4 inline mr-2" />,
      onClick: () => {
        addToWatchLater(videoId);
      },
    },
    {
      label: "Add to Playlist",
      icon: <BookmarkIcon className="w-4 h-4 inline mr-2" />,
      onClick: () => {
        console.log("Add to playlist");
      },
    },
    {
      label: "Download",
      icon: <DownloadIcon className="w-4 h-4 inline mr-2" />,
      onClick: () => {
        downloadVideo(videoId, videoTitle);
      },
    },
    {
      label: "Share",
      icon: <Share2 className="w-4 h-4 inline mr-2" />,
      onClick: () => shareVideo(videoId),
    },
    {
      label: "Report",
      icon: <MessageSquareWarning className="w-4 h-4 inline mr-2" />,
      onClick: () => mutate(videoId),
    },
  ];

  return (
    <div className="flex flex-col space-y-4 w-[435px] h-[350px] mx-2 my-2 hover:bg-gray-100 rounded-xl p-2">
      {/* Thumbnail */}
      <Link to={`/watch/${videoId}`}>
        <LazyImage
          src={getWebpThumbnail(thumbnail)}
          alt="Video Thumbnail"
          className="object-cover rounded-xl"
          width={"435px"}
          height={"245px"}
        />
      </Link>

      <div className="flex flex-row space-x-2">
        {/* Owner PFP */}
        <Link to={`/user/${owner?.username}`} className="flex-shrink-0">
          <LazyImage
            src={owner?.avatar}
            alt={owner?.username}
            className="rounded-full"
            width={10}
            height={10}
            circle
          />
        </Link>

        <div className="flex flex-col cursor-pointer w-full">
          {/* Title and Owner */}
          <Link to={`/watch/${videoId}`}>
            <span className="text-base font-semibold">{title}</span>
          </Link>
          <Link to={`/user/${owner?.username}`}>
            <span className="text-sm text-gray-600 hover:text-black">
              {owner?.username}
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
            <Menu
              trigger={<EllipsisVertical />}
              triggerClasses={"text-gray-500"}
              menuClasses={"flex-col w-[220px] h-auto bg-white"}
            >
              {menuOptions}
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
