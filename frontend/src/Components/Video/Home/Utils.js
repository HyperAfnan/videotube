import { secureFetch, asyncHandler } from "../../../utils/index.js";
import {
  addSingleWatchLater,
  setWatchLater,
} from "../../../Store/watchLaterSlice.js";

export const downloadHandler = asyncHandler(async (videoId, videoTitle) => {
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
});

export const shareHandler = (videoId) => {
  const videoUrl = `${window.location.origin}/watch/${videoId}`;
  navigator.clipboard.writeText(videoUrl);
  alert("Video URL copied to clipboard!");
};

export const addToWatchLaterHandler = asyncHandler(
  async (videoId, dispatch ) => {
    const data = await secureFetch(`/api/v1/user/watchlater/${videoId}`, {
      method: "PUT",
    });
    if (!data.success) {
      alert(data.message || "Failed to add video to Watch Later");
      return;
    }
    dispatch(addSingleWatchLater(data.data));
    alert(data.message || "Video added to Watch Later");
    return data;
  },
);
