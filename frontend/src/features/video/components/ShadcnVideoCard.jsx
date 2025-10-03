import { useState, useRef } from "react";
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
  Check,
} from "lucide-react";
import { getWebpThumbnail, timeAgo } from "@Shared/utils/formatter.js";
import { useWatchLaterOperations } from "@Features/watchlater/hook/useWatchLaterMutation.js";
import {
  shareVideo,
  downloadVideo,
} from "@Shared/components/Menu/menuActions.js";
import { useReportVideo } from "../hook/useVideoMutations.js";
import { Button } from "@Shared/components/ui/button.jsx";
import { useFloatingMenu } from "@Shared/hooks/useFloatingMenu.js";
import { FloatingPortal } from "@floating-ui/react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@Shared/components/ui/dropdown-menu.jsx";
import { Menu } from "@base-ui-components/react/menu";

const VideoCard = ({ thumbnail, title, uploadedAt, views, videoId, owner }) => {
  const { addToWatchLater, isAddingToWatchLater } = useWatchLaterOperations();
  const { mutate: reportVideo } = useReportVideo();
  const [activeAction, setActiveAction] = useState(null);

  // const {
  //   isOpen,
  //   setIsOpen,
  //   refs,
  //   floatingStyles,
  //   getReferenceProps,
  //   getFloatingProps,
  // } = useFloatingMenu();
  //
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
    setIsOpen(false);
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
          <Link to={`/user/${owner?.username}`} className="flex-shrink-0 mt-1">
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

          {/* Action Menu */}
          {/* <div className="flex-shrink-0">
            <button
              type="button"
              className="h-8 w-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              ref={refs.setReference}
              {...getReferenceProps()}
              aria-label="Video options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {isOpen && (
              <FloatingPortal>
                <div
                  className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg py-1 w-56 border border-gray-200 dark:border-zinc-800 z-50"
                  ref={refs.setFloating}
                  style={{ ...floatingStyles }}
                  {...getFloatingProps()}
                >
                  <button
                    className="w-full px-3 py-2 text-left flex items-center hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200"
                    onClick={() =>
                      handleAction("queue", () =>
                        console.log("Add to Queue clicked"),
                      )
                    }
                  >
                    <ListPlus className="mr-2 h-4 w-4" />
                    <span className="flex-1">Add to Queue</span>
                    {activeAction === "queue" && (
                      <Check className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </button>

                  <button
                    className="w-full px-3 py-2 text-left flex items-center hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200"
                    onClick={() =>
                      handleAction("watchlater", () => addToWatchLater(videoId))
                    }
                    disabled={isAddingToWatchLater}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    <span className="flex-1">
                      {isAddingToWatchLater
                        ? "Saving..."
                        : "Save to Watch Later"}
                    </span>
                    {activeAction === "watchlater" && (
                      <Check className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </button>

                  <button
                    className="w-full px-3 py-2 text-left flex items-center hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200"
                    onClick={() =>
                      handleAction("playlist", () =>
                        console.log("Add to Playlist"),
                      )
                    }
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span className="flex-1">Add to Playlist</span>
                    {activeAction === "playlist" && (
                      <Check className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </button>

                  <hr className="my-1 border-gray-200 dark:border-zinc-800" />

                  <button
                    className="w-full px-3 py-2 text-left flex items-center hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200"
                    onClick={() =>
                      handleAction("download", () =>
                        downloadVideo(videoId, title),
                      )
                    }
                  >
                    <Download className="mr-2 h-4 w-4" />
                    <span className="flex-1">Download</span>
                    {activeAction === "download" && (
                      <Check className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </button>

                  <button
                    className="w-full px-3 py-2 text-left flex items-center hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200"
                    onClick={() =>
                      handleAction("share", () => shareVideo(videoId))
                    }
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    <span className="flex-1">Share</span>
                    {activeAction === "share" && (
                      <Check className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </button>

                  <hr className="my-1 border-gray-200 dark:border-zinc-800" />

                  <button
                    className="w-full px-3 py-2 text-left flex items-center hover:bg-gray-100 dark:hover:bg-zinc-800 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() =>
                      handleAction("report", () => reportVideo(videoId))
                    }
                  >
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    <span className="flex-1">Report</span>
                    {activeAction === "report" && (
                      <Check className="ml-2 h-4 w-4 text-green-500" />
                    )}
                  </button>
                </div>
              </FloatingPortal>
            )}
          </div> */}

          <Menu.Root>
            <Menu.Trigger>
              <MoreVertical className="h-5 w-5" />
            </Menu.Trigger>
            <Menu.Portal>
              {/* <Menu.Positioner className="outline-none" sideOffset={8}> */}
              {/*   <Menu.Popup className="origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300"> */}
              {/*     <Menu.Item className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"> */}
              {/*       Add to Library */}
              {/*     </Menu.Item> */}
              {/*     <Menu.Item className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"> */}
              {/*       Add to Playlist */}
              {/*     </Menu.Item> */}
              {/*     <Menu.Separator className="mx-4 my-1.5 h-px bg-gray-200" /> */}
              {/*     <Menu.Item className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"> */}
              {/*       Play Next */}
              {/*     </Menu.Item> */}
              {/*     <Menu.Item className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"> */}{" "}
              {/*       Play Last */} {/*     </Menu.Item> */}
              {/*     <Menu.Separator className="mx-4 my-1.5 h-px bg-gray-200" /> */}
              {/*     <Menu.Item className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"> */}
              {/*       Favorite */}
              {/*     </Menu.Item> */}
              {/*     <Menu.Item className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"> */}
              {/*       Share */}
              {/*     </Menu.Item> */}
              {/*   </Menu.Popup> */}
              {/* </Menu.Positioner> */}
              <Menu.Positioner className="outline-none" sideOffset={8}>
                <Menu.Popup
                  className="
                           origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200 
                           transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 
                           data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300
                           "
                >
                  {videoActions.map((action) => (
                    <Menu.Item
                      key={action.key}
                      className="flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-none select-none data-[highlighted]:relative 
      data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1
      data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
                      onClick={action.onClick}
                      disabled={action.disabled}
                    >
                      {action.label}
                    </Menu.Item>
                  ))}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
