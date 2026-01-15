import VideoCard from "./WatchLaterVideoCard.jsx";
import WatchListSort from "./WatchLateSort.jsx";
import { useState } from "react";
import { useWatchLater } from "../hook/useWatchLaterQueries.js";
import { Badge } from "@/components/ui/badge";

const WatchLaterRightSideContainer = () => {
   const { watchLater, isFetching } = useWatchLater();
   
   const [sortOption, setSortOption] = useState({
      label: "Date Published (newest)",
      filter: (a, b) => new Date(b.video.createdAt) - new Date(a.video.createdAt),
      value: "dataPublishedNewest",
   });

   return (
      <div className="w-full h-screen pl-117.5 pt-10">
         <div className="w-full h-10px flex justify-start items-center p-4">
            <WatchListSort setSortOption={setSortOption} />
            
            {isFetching && (
               <Badge variant="secondary" className="ml-4 animate-pulse">
                  Updating...
               </Badge>
            )}
         </div>
         
         <div className="w-full h-full">
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
                  <p className="text-muted-foreground">No videos in Watch Later</p>
               </div>
            )}
         </div>
      </div>
   );
};

export default WatchLaterRightSideContainer;
