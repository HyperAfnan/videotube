import { VideoService } from "@Features/video/services/video.services.js";
import { notificationService } from "@Shared/services/notification.services.js";
import { useState, useEffect } from "react";

export const useVideo = () => {
   const [error, setError] = useState(null);
   const [videos, setVideos] = useState([]);
   const [loading, setLoading] = useState(false);
   const [page, setPage] = useState(1);
   const getVideos = async (page) => {
      setLoading(true);
      setError(null);
      try {
         const fetchedVideos = await VideoService.getVideos(page);
         page === 1
            ? setVideos(fetchedVideos)
            : setVideos((prevVideos) => [...prevVideos, ...fetchedVideos]);
         setLoading(false);
         return fetchedVideos;
      } catch (err) {
         setError(err.message || "Failed to fetch videos");
         setLoading(false);
         throw err;
      }
   };

   const fetchMoreVideos = async () => {
      const nextPage = page + 1;
      const moreVideos = await getVideos(nextPage);
      setPage(nextPage);
      return moreVideos;
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
            notificationService.error("Failed to download video");
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

   const uploadVideo = async (videoData) => {
      setError(null);
      setLoading(true);
      try {
         const newVideo = await VideoService.upload(videoData);
         setLoading(false);
         return newVideo;
      } catch (err) {
         setLoading(false);
         setError(err.message || "Failed to upload video");
         throw err;
      }
   };

   const updateVideo = async (videoId, videoData) => {
      setError(null);
      setLoading(true);
      try {
         const updatedVideo = await VideoService.update(videoId, videoData);
         setLoading(false);
         return updatedVideo;
      } catch (err) {
         setLoading(false);
         setError(err.message || "Failed to update video");
         throw err;
      }
   };

   const updateAfterUploading = async (data, oldMeta) => {
      setError(null);
      setLoading(true);
      const { thumbnail, ...dataWithoutThumbnail } = data;

      try {
         // uploading the data without thumnbnail
         await VideoService.update(data?._id, dataWithoutThumbnail);

         // uploading the thumbnail if changed
         if (thumbnail !== oldMeta.thumbnail) {
            const formData = new FormData();
            formData.append("thumbnail", thumbnail);
            await VideoService.update(data._id, formData);
         }

         // adding to playlist if any
         if (data.playlist) {
            await VideoService.addToPlaylist(data._id, data.playlist);
         }

         setLoading(false);
      } catch (err) {
         setLoading(false);
         setError(err.message || "Failed to update video");
      }
   };

   const fetchOwner = async (owner) => {
      setError(null);
      setLoading(true);
      try {
         const response = await VideoService.fetchOwner(owner);
         setLoading(false);
         return response
      } catch (err) {
         setError(err.message || "Failed to fetch owner");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      getVideos(1);

      return () => {
         setVideos([]);
         setLoading(false);
         setError(null);
      };
   }, []);

   return { getVideos, loading, fetchVideoById, error, downloadVideo, shareVideo, videos, fetchMoreVideos, uploadVideo, updateVideo, updateAfterUploading, fetchOwner
   };
};
