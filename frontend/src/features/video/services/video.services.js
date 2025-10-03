export const VideoService = {
   async getVideos( page = 1 ) {
      const response = await fetch(`/api/v1/videos?page=${page}`, {
         credentials: "include",
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });
   
      if (response.status !== 200) throw new Error(`Failed to fetch videos: ${response.statusText}`);
   
      const data = await response.json();
      return data?.data?.videos || [];
   },
   
   async fetchById(videoId) {
      const response = await fetch(`/api/v1/videos/${videoId}`, {
         credentials: "include",
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });
   
      if (response.status !== 200) throw new Error(`Failed to fetch video: ${response.statusText}`);
   
      const data = await response.json();
      return data?.data;
   },

   async fetchOwner(ownerId) {
      const response = await fetch(`/api/v1/user/${ownerId}`, {
         credentials: "include",
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });
   
      if (response.status !== 200) throw new Error(`Failed to fetch owner: ${response.statusText}`);
   
      const data = await response.json();
      return data?.data;
   },
   
   async upload(videoData) {
      const response = await fetch("/api/v1/videos", {
         credentials: "include",
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(videoData),
      });
   
      if (response.status !== 201) throw new Error(`Failed to add video: ${response.statusText}`);
   
      const data = await response.json();
      return data?.data;
   },
   
   async update(videoId, videoData) {
      const response = await fetch(`/api/v1/videos/${videoId}`, {
         credentials: "include",
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(videoData),
      });
   
      if (response.status !== 200) throw new Error(`Failed to update video: ${response.statusText}`);
   
      const data = await response.json();
      return data?.data;
   },
   
   async delete(videoId) {
      const response = await fetch(`/api/v1/videos/${videoId}`, {
         credentials: "include",
         method: "DELETE",
         headers: { "Content-Type": "application/json" },
      });
   
      if (response.status !== 200) throw new Error(`Failed to delete video: ${response.statusText}`);
   
      return { success: true, message: "Video deleted successfully" };
   },
   async download(videoId) {
      const response = await fetch(`/api/v1/videos/download/${videoId}`, {
         credentials: "include",
         method: "GET",
      });
   
      if (response.status === 204) throw new Error("Failed to download video");
   
      const blob = await response.blob();
      if (!blob) throw new Error("Failed to download video");
      return blob;
   },
}
