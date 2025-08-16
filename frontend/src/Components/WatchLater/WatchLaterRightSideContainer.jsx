import { useSelector } from "react-redux";
import VideoCard from "./VideoCard.jsx";
import WatchListSort from "./WatchLateSort.jsx";
import { useState } from "react";

const WatchLaterRightSideContainer = () => {
   const { watchList } = useSelector( (state) => state.watchLater);

   const [sortOption, setSortOption] = useState({
      label: "Date Published (newest)",
      filter: (a, b) => new Date(a.video.createdAt) - new Date(b.video.createdAt),
      value: "dataPublishedNewest",
   });

   return (
      <div className="w-full h-screen pl-[470px] pt-[40px]">
         <div className="w-full h-10px flex justify-start items-center p-4 ">
            <WatchListSort setSortOption={setSortOption} />
         </div>
         <div className="w-full h-full ">
            {watchList?.length > 0 ? (
               [...watchList]
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
