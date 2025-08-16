import { EllipsisVerticalIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeWatchLater } from "@Store/slice/watchLaterSlice.js";
import { useFloatingMenu } from "@Hooks/useFloatingMenu.js";
import { timeAgo } from "@Utils";
import { VideoCardOptions } from "../../assets/constants.jsx";
const WatchLaterVideoCard = ({ video , wlId }) => {
   const dispatch = useDispatch();
   const {
      isOpen ,
      setIsOpen,
      refs, 
      floatingStyles,
      getReferenceProps,
      getFloatingProps,
   } = useFloatingMenu();

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
            {isOpen && (
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
                           setIsOpen(false);
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

export default WatchLaterVideoCard;
