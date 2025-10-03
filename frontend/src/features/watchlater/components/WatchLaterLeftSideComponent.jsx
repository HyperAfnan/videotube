import { timeAgo } from "@Shared/utils/formatter.js";
import { useWatchLater } from "../hook/useWatchLaterQueries.js";
import { useAuth } from "@Features/auth/hook/useAuth.js";

export const WatchLaterPreviewButton = ({ onClick, children }) => (
   <button
      className="w-28 h-10 px-4 py-2 text-white rounded-lg transition-colors duration-300 bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
      onClick={onClick}
   >
      {children}
   </button>
);

export default function WatchLaterLeftSideComponent() {
   const { userMeta: { fullname } = {} } = useAuth();
   const { watchLater, isFetching } = useWatchLater();

   const thumbnail = watchLater[0]?.video?.thumbnail;
   const lastUpdated = timeAgo(watchLater[watchLater.length - 1]?.createdAt);

   const totalDuration = watchLater.reduce((acc, video) => {
      if (!video.video || !video.video.duration) return acc;
      return acc + video.video.duration;
   }, 0);

   return (
      <div className="fixed top-20 left-20 w-[360px] h-[700px] rounded-2xl flex flex-col justify-start items-center p-4 bg-gray-300 border border-gray-300 z-20">
         {isFetching && (
            <div className="absolute top-2 right-2">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
         )}

{/*          // watch later preview thumbnail */}
         <div className="h-50 w-full rounded-2xl flex justify-center items-center ">
            <div className="">
               <img
                  src={thumbnail}
                  alt="Watch Later Thumbnail"
                  className="h-[165px] object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
               />
            </div>
         </div>

         <div className="w-full h-auto rounded-lg flex flex-col justify-start items-center text-black">
            <div className="flex justify-start items-center w-full h-[40px] ">
               <span className="text-lg font-semibold pl-4 pt-2 pb-2 pr-2 text-left ">
                  Watch Later
               </span>
            </div>

            <div className="flex justify-start items-center w-full h-[40px]">
               <span className="text-base font-medium pl-4 pt-2 pb-2 pr-2 ">
                  {fullname?.toUpperCase()}
               </span>
            </div>

            <div className="flex justify-evenly items-center w-full h-[40px]">
               <div className="flex justify-start items-center w-auto h-[40px] pl-4 pt-2 pb-2 pr-2">
                  <span className="text-xs text-gray-600 w-full">
                     {watchLater.length} videos
                  </span>
               </div>

               <div className="flex justify-end items-center w-auto h-full pr-4 pl-4 pt-2 pb-2">
                  <span className="text-xs text-gray-600">
                     {totalDuration} minutes
                  </span>
               </div>

               <div className="flex justify-end items-center w-auto h-full pr-4 pl-4 pt-2 pb-2">
                  <span className="text-xs text-gray-600">{lastUpdated}</span>
               </div>
            </div>

            <div className="w-full h-[50px] flex text-base font-normal justify-evenly items-center pt-8">
               <WatchLaterPreviewButton onClick={() => console.log("Play All")}>
                  Play All
               </WatchLaterPreviewButton>
               <WatchLaterPreviewButton onClick={() => console.log("Shuffle")}>
                  Shuffle
               </WatchLaterPreviewButton>
            </div>
         </div>
      </div>
   );
}
