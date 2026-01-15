import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MoreVertical,
  Clock,
  ListPlus,
  Download,
  Bookmark,
  Share2,
  ShieldAlert,
  CircleDot,
} from "lucide-react";
import { getWebpThumbnail, timeAgo } from "@Shared/utils/formatter.js";
import { useWatchLaterOperations } from "@Features/watchlater/hook/useWatchLaterMutation.js";
import {
  shareVideo,
  downloadVideo,
} from "@Shared/components/Menu/menuActions.js";
import { useReportVideo } from "../hook/useVideoMutations.js";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const VideoCard = ({ thumbnail, title, uploadedAt, views, videoId, owner }) => {
  const { addToWatchLater, isAddingToWatchLater } = useWatchLaterOperations();
  const { mutate: reportVideo } = useReportVideo();
  const [activeAction, setActiveAction] = useState(null);

  const formatViews = (viewCount) => {
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M`;
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`;
    }
    return viewCount;
  };

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/600x400?text=Video+Thumbnail";
  };

  const handleAction = (action, callback) => {
    setActiveAction(action);
    callback();
    setTimeout(() => setActiveAction(null), 1500);
  };

  const videoActions = [
    {
      key: "queue",
      label: "Add to Queue",
      icon: ListPlus,
      onClick: () =>
        handleAction("queue", () => console.log("Add to Queue clicked")),
      showCheck: activeAction === "queue",
    },
    {
      key: "watchlater",
      label: isAddingToWatchLater ? "Saving..." : "Save to Watch Later",
      icon: Clock,
      onClick: () => handleAction("watchlater", () => addToWatchLater(videoId)),
      showCheck: activeAction === "watchlater",
      disabled: isAddingToWatchLater,
    },
    {
      key: "playlist",
      label: "Add to Playlist",
      icon: Bookmark,
      onClick: () =>
        handleAction("playlist", () => console.log("Add to Playlist")),
      showCheck: activeAction === "playlist",
    },
    {
      key: "download",
      label: "Download",
      icon: Download,
      onClick: () =>
        handleAction("download", () => downloadVideo(videoId, title)),
      showCheck: activeAction === "download",
    },
    {
      key: "share",
      label: "Share",
      icon: Share2,
      onClick: () => handleAction("share", () => shareVideo(videoId)),
      showCheck: activeAction === "share",
    },
    {
      key: "report",
      label: "Report",
      icon: ShieldAlert,
      onClick: () => handleAction("report", () => reportVideo(videoId)),
      showCheck: activeAction === "report",
      className:
        "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300",
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl transition-colors duration-200 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800">
      <div className="aspect-video relative overflow-hidden rounded-xl group">
        <Link to={`/watch/${videoId}`}>
          <div className="relative w-full h-full">
            <img
              src={getWebpThumbnail(thumbnail)}
              alt={title}
              className="object-cover w-full h-full rounded-xl transition-transform duration-300"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
        </Link>
      </div>

      <div className="p-3">
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <Link to={`/user/${owner?.username}`} className="shrink-0 mt-1">
            <div className="h-9 w-9 rounded-full overflow-hidden">
              <img
                src={owner?.avatar}
                alt={owner?.username}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${owner?.username?.charAt(0)}&background=random`;
                }}
              />
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            {/* Video Title */}
            <Link to={`/watch/${videoId}`}>
              <h3 className="font-medium leading-tight line-clamp-2 text-gray-900 dark:text-zinc-100 hover:underline">
                {title}
              </h3>
            </Link>

            {/* Channel Name */}
            <Link to={`/user/${owner?.username}`}>
              <p className="text-sm text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 transition-colors mt-1">
                {owner?.username}
              </p>
            </Link>

            {/* Video Meta */}
            <div className="flex items-center text-xs text-gray-500 dark:text-zinc-500 mt-1">
              <span>{formatViews(views)} views</span>
              <CircleDot className="h-1.5 w-1.5 mx-1" />
              <span>{timeAgo(uploadedAt)}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {videoActions.map((action, index) => (
                <div key={action.key}>
                  {index === 3 && <DropdownMenuSeparator />}
                  {index === 5 && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={action.className}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </DropdownMenuItem>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
