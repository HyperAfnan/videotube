import { VideoService } from "@Services/video.services.js";
import { notificationService } from "@Services/notification.services.js";
import { useState } from "react";

export const useVideo = () => {
   const [error, setError] = useState(null);

   const fetchAllVideos = async () => {
      setError(null);
      try {
         const videos = await VideoService.fetchAll();
         return videos;
      } catch (err) {
         setError(err.message || "Failed to fetch videos");
         throw err;
      }
   };

   const fetchVideoById = async (videoId) => {
      setError(null);
      try {
         const video = await VideoService.fetchById(videoId);
         return video;
      } catch (err) {
         setError(err.message || "Failed to fetch video");
         throw err;
      }
   };
   const downloadVideo = async (videoId, videoTitle) => {
      setError(null);
      (async () => {
         try {
            const blob = await VideoService.download(videoId);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = `${videoTitle}.mp4`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
         } catch (error) {
            notificationService.error("Failed to download video", {
               unstyled: true,
               classNames: {
                  toast:
                     "w-80 h-15 flex flex-row items-center bg-white shadow-lg rounded-lg p-4 justify-between",
                  title: "text-md text-gray-800 font-normal text-center",
               },
            });
            setError(error.message || "Failed to download video");
         }
      })();
   };
   const shareVideo = (videoId) => {
      const videoUrl = `${window.location.origin}/watch/${videoId}`;
      navigator.clipboard.writeText(videoUrl);
      notificationService.info("Video link copied to clipboard", {
         unstyled: true,
         classNames: {
            toast:
               "w-80 h-15 flex flex-row items-center bg-white shadow-lg rounded-lg p-4 justify-between",
            title: "text-md text-gray-800 font-normal text-center",
         },
      });
   };

   return { fetchAllVideos, fetchVideoById, error, downloadVideo, shareVideo };
};
