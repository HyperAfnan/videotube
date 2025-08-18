export const PlaylistService = {
   createPlaylist: async (playlistName, description) => {
      const response = await fetch("/api/v1/playlist", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ name: playlistName, description }),
      });
      if (response.status !== 201)
         throw new Error(`Failed to create playlist ${response.statusText}`);
      return response.json();
   },

   addToPlaylist: async (videoId, playlistId) => {
      const response = await fetch(
         `/api/v1/playlist/add/${videoId}/${playlistId}`,
         {
            method: "PATCH",
         },
      );
      if (!response.ok) {
         throw new Error("Failed to add video to playlist");
      }
      return response.json();
   },

   removeFromPlaylist: async (videoId, playlistId) => {
      const response = await fetch(
         `/api/v1/playlist/remove/${videoId}/${playlistId}`,
         {
            method: "PATCH",
         },
      );
      if (!response.ok) {
         throw new Error("Failed to remove video from playlist");
      }
      return response.json();
   },

   getUserPlaylists: async (userId) => {
      const response = await fetch(`/api/v1/playlist/user/${userId}`, {
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });
      if (response.status !== 200)
         throw new Error(`Failed to fetch user playlists ${response.statusText}`);
      return response.json();
   },
};
