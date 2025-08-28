import { Link } from "react-router-dom";
import { BookmarkIcon, EllipsisVerticalIcon, Download, ListPlusIcon, Share2Icon, Trash, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { timeAgo } from "@Shared/utils/formatter.js";
import { useWatchLaterOperations } from "../hook/useWatchLaterMutation.js";
import { shareVideo, downloadVideo } from "@Shared/components/Menu/menuActions.js";
import { Menu } from "@Shared/components/Menu/Menu.jsx";

const WatchLaterVideoCard = ({ video }) => {
   const { removeFromWatchLater, isRemovingFromWatchLater } = useWatchLaterOperations();
   const menuOptions = [
      {
         label: "Add to Queue",
         icon: <ListPlusIcon className="w-5 h-5 text-gray-600" />,
         onClick: () => console.log("Add to Queue clicked"),
      },
      {
         label: "Add to Playlist",
         icon: <BookmarkIcon className="w-5 h-5 text-gray-600" />,
         onClick: () => console.log("Add to playlist"),
      },
      {
         label: "Download Video",
         icon: <Download className="w-5 h-5 text-gray-600" />,
         onClick: () => downloadVideo(video._id, video.title),
      },
      {
         label: isRemovingFromWatchLater ? "Removing..." : "Remove from Watch Later",
         icon: <Trash className="w-5 h-5 text-gray-600" />,
         onClick: async () => removeFromWatchLater(video._id),
      },
      {
         label: "Share Video",
         icon: <Share2Icon className="w-5 h-5 text-gray-600" />,
         onClick: () => shareVideo(video._id),
      },
      {
         label: "Move To Top",
         icon: <ArrowBigUp className="w-5 h-5 text-gray-600" />,
         onClick: () => console.log("Move To Top"),
      },
      {
         label: "Move To Down",
         icon: <ArrowBigDown className="w-5 h-5 text-gray-600" />,
         onClick: () => console.log("Move To Down"),
      },
   ];

   return (
      <div className="w-full h-auto flex justify-start items-center p-4 hover:bg-gray-200 transition-colors duration-300 cursor-pointer rounded-lg">
         {/* Video thumbnail */}
         <Link to={`/watch/${video._id}`}>
            <div className="flex-shrink-0 w-auto h-auto ">
               <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-60 object-cover rounded-lg"
               />
            </div>
         </Link>
         
         {/* Video info */}
         <div className="flex flex-col justify-start items-start pl-4 pb-2 pr-2 pt-2 space-y-1 w-full">
            <Link to={`/watch/${video._id}`} className="flex flex-col space-y-1">
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
         
         {/* Action menu */}
         <Menu trigger={<EllipsisVerticalIcon />}
            triggerClasses={" text-gray-500 hover:text-gray-700 "}
            menuClasses={"w-[250px] h-auto"}
         >
            {menuOptions}
         </Menu>
      </div>
   );
};
export default WatchLaterVideoCard;
