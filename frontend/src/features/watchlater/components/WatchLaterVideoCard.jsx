import { Link } from "react-router-dom";
import { BookmarkIcon, EllipsisVerticalIcon, Download, ListPlusIcon, Share2Icon, Trash, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { useFloatingMenu } from "@Shared/hooks/useFloatingMenu.js";
import { timeAgo } from "@Shared/utils/formatter.js";
import { useWatchLaterOperations } from "../hook/useWatchLaterMutation.js";
import { videoActions } from "../utils/videoActions.js";

const MenuOption = ({ icon, label, onClick }) => (
   <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-4" onClick={onClick} >
      {icon} <span className="text-sm text-black">{label}</span>
   </div>
);

MenuOption.QueueIcon = <ListPlusIcon className="w-5 h-5 text-gray-600" />;
MenuOption.PlaylistIcon = <BookmarkIcon className="w-5 h-5 text-gray-600" />;
MenuOption.DownloadIcon = <Download className="w-5 h-5 text-gray-600" />;
MenuOption.TrashIcon = <Trash className="w-5 h-5 text-gray-600" />;
MenuOption.ShareIcon = <Share2Icon className="w-5 h-5 text-gray-600" />;
MenuOption.MoveUpIcon = <ArrowBigUp className="w-5 h-5 text-gray-600" />;
MenuOption.MoveDownIcon = <ArrowBigDown className="w-5 h-5 text-gray-600" />;

const WatchLaterVideoCard = ({ video }) => {
   const { removeFromWatchLater, isRemovingFromWatchLater } = useWatchLaterOperations();
   const { downloadVideo, shareVideo } = videoActions;
   const { isOpen, setIsOpen, refs, floatingStyles, getReferenceProps, getFloatingProps } = useFloatingMenu();

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
         <div className="h-full w-10 ">
            <EllipsisVerticalIcon
               className={`h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer ${
                  isRemovingFromWatchLater ? 'opacity-50 cursor-not-allowed' : ''
               }`}
               ref={refs.setReference}
               {...getReferenceProps()}
            />
            
            {isOpen && (
               <div
                  ref={refs.setFloating}
                  className="bg-white shadow-xl rounded-lg w-[250px] h-auto"
                  style={{ ...floatingStyles }}
                  {...getFloatingProps()}
               >
                  <MenuOption
                     icon={MenuOption.QueueIcon}
                     label="Add to Queue"
                     onClick={() => {
                        setIsOpen(false);
                        console.log("Add to Queue clicked");
                     }}
                  />
                  
                  <MenuOption
                     icon={MenuOption.PlaylistIcon}
                     label="Add to Playlist"
                     onClick={() => {
                        setIsOpen(false);
                        console.log("Add to playlist");
                     }}
                  />
                  
                  <MenuOption
                     icon={MenuOption.DownloadIcon}
                     label="Download Video"
                     onClick={() => {
                        setIsOpen(false);
                        downloadVideo(video._id, video.title);
                     }}
                  />
                  
                  <MenuOption
                     icon={MenuOption.TrashIcon}
                     label={isRemovingFromWatchLater ? "Removing..." : "Remove from Watch Later"}
                     onClick={async () => {
                        setIsOpen(false);
                        await removeFromWatchLater(video._id);
                     }}
                  />
                  
                  <MenuOption
                     icon={MenuOption.ShareIcon}
                     label="Share Video"
                     onClick={() => {
                        setIsOpen(false);
                        shareVideo(video._id);
                     }}
                  />
                  
                  <MenuOption
                     icon={MenuOption.MoveUpIcon}
                     label="Move To Top"
                     onClick={() => {
                        setIsOpen(false);
                        console.log("Move To Top");
                     }}
                  />
                  
                  <MenuOption
                     icon={MenuOption.MoveDownIcon}
                     label="Move To Down"
                     onClick={() => {
                        setIsOpen(false);
                        console.log("Move To Down");
                     }}
                  />
               </div>
            )}
         </div>
      </div>
   );
};
export default WatchLaterVideoCard;
