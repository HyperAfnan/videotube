import { setCredentials } from "@Features/auth/store/authSlice.js";
import { useState } from "react";
import { useDispatch , useSelector } from "react-redux";
import { PlaylistService } from "../services/playlist.services.js";
import { useAuth } from "@Features/auth/hook/useAuth.js";

export const usePlaylist = () => {
   const { user } = useAuth();
   const [error, setError] = useState(null);
   const dispatch = useDispatch();
   const { playlists } = useSelector((state) => state.auth.userMeta);
   const [loading, setLoading] = useState(false);

   const fetchUserPlaylists = async () => {
      setLoading(true);
      setError(null);
      try {
         const response = await PlaylistService.getUserPlaylists(user._id);
         console.log(response);
         setLoading(false);
         dispatch(setCredentials({ userMeta: { playlists: response.playlists } }));
         return { status: "success" };
      } catch (err) {
         setLoading(false);
         setError(err.message);
      }
   };

   const addToPlaylist = async (playlistId, video) => {
      setLoading(true);
      setError(null);
      try {
         const response = await PlaylistService.addToPlaylist(playlistId, video);
         setLoading(false);
         const updatedPlaylists = playlists.map((playlist) =>
            playlist._id === playlistId ? response.data.playlist : playlist,
         );
         dispatch(setCredentials({ userMeta: { playlists: updatedPlaylists } }));
         return { status: "success" };
      } catch (err) {
         setLoading(false);
         setError(err.message);
      }
   };

   return { playlists, error , fetchUserPlaylists , loading , addToPlaylist };
};
