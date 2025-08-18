import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
   addSingleWatchLater,
   setWatchLater,
   removeWatchLater
} from "@Store/slice/watchLaterSlice.js";
import { useSelector } from "react-redux";
import { useState } from "react";
import { watchLaterService } from "@Services/watchlater.services.js";
import { notificationService } from "@Services/notification.services.js";

export const useWatchLater = () => {
   const dispatch = useDispatch();
   const [error, setError] = useState(null);
   const { watchList: watchLater } = useSelector((state) => state.watchLater);
   const isInWatchLater = (videoId) => watchLater?.some( (watchlater) => watchlater.video._id === videoId);

   const fetchWatchLater = async () => {
      setError(null);
      try {
         const data = await watchLaterService.fetchAll();
         dispatch(setWatchLater(data));
      } catch (err) {
         setError(err.message || "Failed to fetch watch later videos");
      }
   };

   const removeFromWatchLater = async (videoId) => {
      setError(null);
      try {
         if (!isInWatchLater(videoId)) throw new Error("Video not found in Watch Later");
         const response = await watchLaterService.remove(videoId);
         if (response.success) {
            dispatch(removeWatchLater(videoId));
            notificationService.success("Video removed from Watch Later", {
               unstyled: true,
               classNames: {
                  toast: "w-80 h-15 flex flex-row items-center bg-white shadow-lg rounded-lg p-4 justify-between",
                  title: "text-md text-gray-800 font-normal text-center",
               },
            });
         }
      } catch (err) {
         notificationService.error("Failed to remove video from Watch Later", {
            unstyled: true,
            classNames: {
               toast:
                  "w-80 h-15 flex flex-row items-center bg-white shadow-lg rounded-lg p-4 justify-between",
               title: "text-md text-gray-800 font-normal text-center",
            },
         });
         setError(err.message || "Failed to remove video");
      }
   };

   const addToWatchLater = async (videoId) => {
      setError(null);
      try {
         if (isInWatchLater(videoId)) throw new Error("Video already in Watch Later");

         const updated = await watchLaterService.add(videoId);
         dispatch(addSingleWatchLater(updated));
         notificationService.info("Saved to Watch Later", {
            action: {
               label: "Undo",
               onClick: () => removeFromWatchLater(videoId),
            },
            unstyled: true,
            classNames: {
               toast:
                  "w-80 h-15 flex flex-row items-center bg-white shadow-lg rounded-lg p-4 justify-between",
               title: "text-md text-gray-800 font-normal text-center",
               actionButton: "text-blue-500 hover:text-blue-700 text-center",
            },
         });
      } catch (err) {
         notificationService.error("Failed to add video to Watch Later", {
            unstyled: true,
            classNames: {
               toast:
                  "w-80 h-15 flex flex-row items-center bg-white shadow-lg rounded-lg p-4 justify-between",
               title: "text-md text-gray-800 font-normal text-center",
            },
         });
         setError(err.message || "Failed to add video");
      }
   };

   useEffect(() => {
      if (watchLater?.length == 0) fetchWatchLater();
   }, [watchLater?.length]);

   return { watchLater, error, addToWatchLater , removeFromWatchLater };
};
