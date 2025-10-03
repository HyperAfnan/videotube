export const watchLaterService = {
   async fetchAll() {
      const response = await fetch("/api/v1/user/watchlater", {
         credentials: "include",
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });

      if (response.status !== 200) throw new Error(`Failed to fetch watch later videos: ${response.statusText}`);

      const data = await response.json();
      return data?.data;
   },

   async add(videoId) {
      const response = await fetch(`/api/v1/user/watchlater/${videoId}`, {
         credentials: "include",
         method: "PUT",
      });

      if (response.status !== 201) {
         throw new Error(`Failed to add video: ${response.statusText}`);
      }

      const data = await response.json();
      return data?.data;
   },

   async remove(videoId) {
      const response = await fetch(`/api/v1/user/watchlater/${videoId}`, {
         credentials: "include",
         method: "DELETE",
      });

      if (response.status !== 201) throw new Error(`Failed to remove video: ${response.statusText}`);
      return { success: true, message: "Video removed from Watch Later successfully" }
   },
};
