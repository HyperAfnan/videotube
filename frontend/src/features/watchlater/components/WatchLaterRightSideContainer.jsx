import VideoCard from "./WatchLaterVideoCard.jsx";
import WatchListSort from "./WatchLateSort.jsx";
import { useState } from "react";
import { useWatchLater } from "../hook/useWatchLaterQueries.js";

const WatchLaterRightSideContainer = () => {
   const { watchLater, isFetching } = useWatchLater();
   
   const [sortOption, setSortOption] = useState({
      label: "Date Published (newest)",
      filter: (a, b) => new Date(b.video.createdAt) - new Date(a.video.createdAt),
      value: "dataPublishedNewest",
   });

   return (
      <div className="w-full h-screen pl-[470px] pt-[40px]">
         <div className="w-full h-10px flex justify-start items-center p-4 ">
            <WatchListSort setSortOption={setSortOption} />
            
            {isFetching && (
               <span className="ml-4 text-sm text-gray-500">Updating...</span>
            )}
         </div>
         
         <div className="w-full h-full ">
            {watchLater?.length > 0 ? (
               [...watchLater]
                  .sort(sortOption.filter)
                  .map((watchLater) => (
                     <VideoCard
                        key={watchLater?.video?._id ?? watchLater._id}
                        video={watchLater.video}
                        wlId={watchLater._id}
                     />
                  ))
            ) : (
               <div className="w-full h-full flex justify-center items-center">
                  <span className="text-gray-500">No videos in Watch Later</span>
               </div>
            )}
         </div>
      </div>
   );
};

export default WatchLaterRightSideContainer;
