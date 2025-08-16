import { useSelector } from "react-redux";
import {
   WatchLaterPreview,
   WatchLaterPreviewThumbnail,
   WatchLaterPreviewButton,
   timeAgo,
} from "./WatchLaterUtils.jsx";

export default function WatchLaterLeftSideComponent() {
   const { fullname } = useSelector((state) => state.auth.userMeta);
   const { watchList } = useSelector( (state) => state.watchLater);
   const thumbnail = watchList[0]?.video?.thumbnail;
   const lastUpdated = timeAgo(watchList[watchList.length - 1]?.createdAt);

   return (
      <div className="w-4/12  h-[800px] flex justify-center items-start ">
         <WatchLaterPreview>
            <WatchLaterPreviewThumbnail thumbnail={thumbnail} />
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
                        {watchList.length} videos
                     </span>
                  </div>
                  <div className="flex justify-end items-center w-auto h-full pr-4 pl-4 pt-2 pb-2">
                     <span className="text-xs text-gray-600">
                        {watchList.reduce((acc, video) => {
                           if (!video.video || !video.video.duration) return acc;
                           return acc + video.video.duration;
                        }, 0)}{" "}
                        minutes
                     </span>
                  </div>
                  <div className="flex justify-end items-center w-auto h-full pr-4 pl-4 pt-2 pb-2">
                     <span className="text-xs text-gray-600">{lastUpdated}</span>
                  </div>
               </div>
               <div className="w-full h-[50px] flex text-base font-normal justify-evenly items-center pt-8">
                  <WatchLaterPreviewButton onClick={() => { }}>
                     Play All
                  </WatchLaterPreviewButton>

                  <WatchLaterPreviewButton onClick={() => { }}>
                     Shuffle
                  </WatchLaterPreviewButton>
               </div>
            </div>
         </WatchLaterPreview>
      </div>
   );
}
