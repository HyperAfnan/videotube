import { PlaylistService } from "@Services/playlist.services.js";
import { useState, useEffect } from "react";

export const usePlaylist = (userId) => {
   const [playlists, setPlaylists] = useState([]);
   const [error, setError] = useState(null);

   const fetchUserPlaylists = async () => {
      setError(null);
      try {
         const response = await PlaylistService.getUserPlaylists(userId);
         setPlaylists(response.data[0].playlists);
      } catch (err) {
         setError(err.message);
      }
   };

   useEffect(() => {
      if (userId) {
         fetchUserPlaylists();
      }
   }, [userId]);

   return { playlists, error };
};
