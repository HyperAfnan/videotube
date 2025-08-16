import {
   BookmarkIcon,
   Download,
   ListPlusIcon,
   Share2Icon,
   Trash,
   ArrowBigUp,
   ArrowBigDown,
} from "lucide-react";

export const VideoCardOptions = [
   {
      label: "Add To Queue",
      value: "addToQueue",
      onClick: () => console.log("Add to Queue"),
      icon: <ListPlusIcon className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Add To Playlist",
      value: "addToPlaylist",
      onClick: () => console.log("Add to Playlist"),
      icon: <BookmarkIcon className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Download Video",
      value: "download",
      onClick: async (videoId, videoTitle) => {
         try {
            const res = await fetch(`/api/v1/videos/download/${videoId}`, {
               method: "GET",
               credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to download");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${videoTitle}.mp4`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
         } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download video");
         }
      },
      icon: <Download className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Remove from Watch Later",
      value: "remove",
      onClick: async (_, __, dispatch, removeWaterLater, wlId) => {
         fetch(`/api/v1/user/watchlater/${_}`, {
            method: "DELETE",
            credentials: "include",
         })
            .then((res) => {
               res.status === 201
                  ? dispatch(removeWaterLater(wlId))
                  : alert("Failed to remove video from Watch Later");
            })
            .catch((error) => console.error("Error:", error));
      },
      icon: <Trash className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Share Video",
      value: "share",
      onClick: (videoId) => {
         const videoUrl = `${window.location.origin}/watch/${videoId}`;
         navigator.clipboard.writeText(videoUrl);
         alert("Video URL copied to clipboard!");
      },
      icon: <Share2Icon className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Move To Top",
      value: "moveToTop",
      onClick: () => console.log("Move to Top"),
      icon: <ArrowBigUp className="w-5 h-5 text-gray-600" />,
   },
   {
      label: "Move To Down",
      value: "moveToDown",
      onClick: () => console.log("Move to Down"),
      icon: <ArrowBigDown className="w-5 h-5 text-gray-600" />,
   },
];
