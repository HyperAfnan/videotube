import React, { useState } from "react";
import {
   BookmarkIcon,
   Download,
   ListPlusIcon,
   Share2Icon,
   Trash,
   ArrowBigUp,
   ArrowBigDown,
} from "lucide-react";
import { EllipsisVerticalIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
   useFloating,
   offset,
   flip,
   shift,
   autoUpdate,
   useClick,
   useDismiss,
   useRole,
   useInteractions,
} from "@floating-ui/react";
import { useDispatch } from "react-redux";
import { removeWatchLater } from "../../Store/watchLaterSlice.js";

export const WatchLaterPreviewThumbnail = ({ thumbnail }) => {
   return (
      <div className="h-50 w-full rounded-2xl flex justify-center items-center ">
         <div className="">
            <img
               src={thumbnail}
               alt="Watch Later Thumbnail"
               className="h-[165px] object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
            />
         </div>
      </div>
   );
};

export const timeAgo = (date) => {
   const now = new Date();
   const seconds = Math.floor((now - new Date(date)) / 1000);

   const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
   ];

   for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
         return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
   }
   return "just now";
};

export const WatchLaterPreview = ({ children }) => (
   <div className="w-[360px] h-[700px] rounded-2xl flex flex-col justify-start items-center p-4 bg-gray-300 border-1 border-gray-300">
      {children}
   </div>
);

export const WatchLaterPreviewButton = ({ onClick, children }) => (
   <button
      className="w-28 h-10 px-4 py-2 text-white rounded-lg  transition-colors duration-300 bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
      onClick={onClick}
   >
      {children}
   </button>
);

const VideoCardOptions = [
   {
      label: "Add To Queue",
      value: "addToQueue",
      onClick: () => console.log("Add to Queue"),
      icon: <ListPlusIcon className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Add To Playlist",
      value: "addToPlaylist",
      onClick: () => console.log("Add to Playlist"),
      icon: <BookmarkIcon className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Download Video",
      value: "download",
      onClick: async (videoId, videoTitle) => {
         try {
            const res = await fetch(`/api/v1/videos/download/${videoId}`, {
               method: "GET",
               credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to download");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${videoTitle}.mp4`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
         } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download video");
         }
      },
      icon: <Download className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Remove from Watch Later",
      value: "remove",
      onClick: async (_, __, dispatch, removeWaterLater, wlId) => {
         fetch(`/api/v1/user/watchlater/${_}`, {
            method: "DELETE",
            credentials: "include",
         })
            .then((res) => {
               res.status === 201
                  ? dispatch(removeWaterLater(wlId))
                  : alert("Failed to remove video from Watch Later");
            })
            .catch((error) => console.error("Error:", error));
      },
      icon: <Trash className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Share Video",
      value: "share",
      onClick: (videoId) => {
         const videoUrl = `${window.location.origin}/watch/${videoId}`;
         navigator.clipboard.writeText(videoUrl);
         alert("Video URL copied to clipboard!");
      },
      icon: <Share2Icon className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Move To Top",
      value: "moveToTop",
      onClick: () => console.log("Move to Top"),
      icon: <ArrowBigUp className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Move To Down",
      value: "moveToDown",
      onClick: () => console.log("Move to Down"),
      icon: <ArrowBigDown className="w-5 h-5 text-gray-600" />,
   },
];

export const WatchLaterVideoCard = ({ video , wlId }) => {
   const dispatch = useDispatch();
   const [threeDotMenuOpen, setThreeDotMenuOpen] = useState(false);
   const { refs, floatingStyles, context } = useFloating({
      placement: "bottom-start",
      open: threeDotMenuOpen,
      onOpenChange: setThreeDotMenuOpen,
      middleware: [offset(10), flip(), shift()],
      whileElementsMounted: autoUpdate,
   });
   const click = useClick(context);
   const dismiss = useDismiss(context);
   const role = useRole(context);
   const { getReferenceProps, getFloatingProps } = useInteractions([
      click,
      dismiss,
      role,
   ]);

   return (
      <div className="w-full h-auto flex justify-start items-center p-4 hover:bg-gray-200 transition-colors duration-300 cursor-pointer rounded-lg">
         <Link to={`/watch/${video._id}`}>
            <div className="flex-shrink-0 w-auto h-auto ">
               <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-60  object-cover rounded-lg"
               />
            </div>
         </Link>
         <div className="flex flex-col justify-start items-start pl-4 pb-2 pr-2 pt-2 space-y-1 w-full">
            <Link to={`/watch/${video._id}`} className="flex flex-col  space-y-1">
               <span className="text-base font-medium">{video.title}</span>
               <div className="flex space-x-2 items-center">
                  <span className="text-xs text-gray-600 font-normal">
                     {video.owner.username}
                  </span>
                  <span>•</span>
                  <span className="text-xs text-gray-600 font-normal">
                     {video.views} views
                  </span>
                  <span>•</span>
                  <span className="text-xs text-gray-500 font-normal">
                     {timeAgo(video.createdAt)}
                  </span>
               </div>
            </Link>
         </div>
         <div className="h-full w-10 ">
            <EllipsisVerticalIcon
               className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer"
               ref={refs.setReference}
               {...getReferenceProps()}
            />

            {threeDotMenuOpen && (
               <div
                  ref={refs.setFloating}
                  className="bg-white shadow-xl rounded-lg w-[250px] h-auto"
                  style={{ ...floatingStyles }}
                  {...getFloatingProps()}
               >
                  {VideoCardOptions.map((option) => (
                     <div
                        key={option.value}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-4 "
                        onClick={async () => {
                           await option.onClick(
                              video._id,
                              video.title,
                              dispatch,
                              removeWatchLater,
                              wlId
                           );
                           setThreeDotMenuOpen(false);
                        }}
                     >
                        {option.icon}
                        <span className="text-sm">{option.label}</span>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};
