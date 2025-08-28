import { VideoService } from "@Features/video/services/video.services.js";

const shareVideo = (videoId) => {
  const videoUrl = `${window.location.origin}/video/${videoId}`;
  navigator.clipboard.writeText(videoUrl);
};

const downloadVideo = async (videoId, videoTitle) => {
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
    console.error("Failed to download video:", error);
    alert("Failed to download video");
  }
};

export { shareVideo, downloadVideo };
