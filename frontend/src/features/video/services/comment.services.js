export const CommentService = {
   async getVideoComments( videoId ) {
      const response = await fetch(`/api/v1/comments/v/${videoId}`, {
         credentials: "include",
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });
   
      if (response.status !== 200) throw new Error(`Failed to fetch video: ${videoId} comments: ${response.statusText}`);
   
      const data = await response.json();
      return data?.data || [];
   },

   async addComment( commentData ) {
      console.log("Adding comment:", commentData);
      const response = await fetch(`/api/v1/comments/v/${commentData.videoId}`, {
         credentials: "include",
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(commentData),
      });

      if (response.status !== 201) throw new Error(`Failed to add comment: ${response.statusText}`);

      const data = await response.json();
      return data?.data;
   },

   async toggleCommentLike( commentId ) {
      const response = await fetch(`/api/v1/likes/toggle/c/${commentId}`, {
         credentials: "include",
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({}),
      });
      
      if (response.status !== 200 && response.status !== 201) {
         throw new Error(`Failed to like comment: ${response.statusText}`);
      }

      const data = await response.json();
      return data?.data;
   },
   
   // async fetchById(videoId) {
   //    const response = await fetch(`/api/v1/videos/${videoId}`, {
   //       credentials: "include",
   //       method: "GET",
   //       headers: { "Content-Type": "application/json" },
   //    });
   // 
   //    if (response.status !== 200) throw new Error(`Failed to fetch video: ${response.statusText}`);
   // 
   //    const data = await response.json();
   //    return data?.data;
   // },
   //
   // async fetchOwner(ownerId) {
   //    const response = await fetch(`/api/v1/user/${ownerId}`, {
   //       credentials: "include",
   //       method: "GET",
   //       headers: { "Content-Type": "application/json" },
   //    });
   // 
   //    if (response.status !== 200) throw new Error(`Failed to fetch owner: ${response.statusText}`);
   // 
   //    const data = await response.json();
   //    return data?.data;
   // },
   // 
   // async upload(videoData) {
   //    const response = await fetch("/api/v1/videos", {
   //       credentials: "include",
   //       method: "POST",
   //       headers: { "Content-Type": "application/json" },
   //       body: JSON.stringify(videoData),
   //    });
   // 
   //    if (response.status !== 201) throw new Error(`Failed to add video: ${response.statusText}`);
   // 
   //    const data = await response.json();
   //    return data?.data;
   // },
   // 
   // async update(videoId, videoData) {
   //    const response = await fetch(`/api/v1/videos/${videoId}`, {
   //       credentials: "include",
   //       method: "PATCH",
   //       headers: { "Content-Type": "application/json" },
   //       body: JSON.stringify(videoData),
   //    });
   // 
   //    if (response.status !== 200) throw new Error(`Failed to update video: ${response.statusText}`);
   // 
   //    const data = await response.json();
   //    return data?.data;
   // },
   // 
   // async delete(videoId) {
   //    const response = await fetch(`/api/v1/videos/${videoId}`, {
   //       credentials: "include",
   //       method: "DELETE",
   //       headers: { "Content-Type": "application/json" },
   //    });
   // 
   //    if (response.status !== 200) throw new Error(`Failed to delete video: ${response.statusText}`);
   // 
   //    return { success: true, message: "Video deleted successfully" };
   // },
   // async download(videoId) {
   //    const response = await fetch(`/api/v1/videos/download/${videoId}`, {
   //       credentials: "include",
   //       method: "GET",
   //    });
   // 
   //    if (response.status === 204) throw new Error("Failed to download video");
   // 
   //    const blob = await response.blob();
   //    if (!blob) throw new Error("Failed to download video");
   //    return blob;
   // },
}
