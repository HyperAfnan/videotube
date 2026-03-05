import { useQuery } from "@tanstack/react-query";
import { PlaylistService } from "../services/playlist.services.js";
import { playlistKeys } from "../constants/queryKey.js";
import { useAuth } from "@Features/auth/hook/useAuth.js";

export const useUserPlaylist = ( options = {} ) => {
   const { user } = useAuth();
   return useQuery({
      queryKey: playlistKeys.list(),
      queryFn:  PlaylistService.getUserPlaylists(user._id),
      enabled: Boolean(user._id),
      staleTime: 5 * 60 * 1000, 
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
      ...options,
   });
};

export const usePlaylistById = ( playlistId , options = {} ) => useQuery({
      queryKey: playlistKeys.detail(playlistId),
      queryFn: () => PlaylistService.getPlaylistById(playlistId),
      enabled: Boolean(playlistId),
      staleTime: 5 * 60 * 1000, 
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
      ...options,
   });
