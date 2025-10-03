import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlaylistService } from "../services/playlist.services.js";
import { playlistKeys } from "../constants/queryKey.js";
import { notificationService } from "@Shared/services/notification.services.js";

export const useCreatePlaylist = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => PlaylistService.createPlaylist(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.list() });
      notificationService.success("Playlist created successfully");
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      notificationService.error(error.message || "Failed to create playlist");
      if (options.onError) options.onError(error);
    },
    ...options,
  });
};

export const useAddToPlaylist = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, video }) =>
      PlaylistService.addToPlaylist(playlistId, video),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.list() });
      queryClient.invalidateQueries({
        queryKey: playlistKeys.detail(variables.playlistId),
      });
      notificationService.success("Video added to playlist");
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      notificationService.error(
        error.message || "Failed to add video to playlist",
      );
      if (options.onError) options.onError(error);
    },
    ...options,
  });
};

export const useRemoveFromPlaylist = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, videoId }) =>
      PlaylistService.removeFromPlaylist(playlistId, videoId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.list() });
      queryClient.invalidateQueries({
        queryKey: playlistKeys.detail(variables.playlistId),
      });
      notificationService.success("Video removed from playlist");
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      notificationService.error(
        error.message || "Failed to remove video from playlist",
      );
      if (options.onError) options.onError(error);
    },
    ...options,
  });
};

export const useDeletePlaylist = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playlistId) => PlaylistService.deletePlaylist(playlistId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.list() });
      notificationService.success("Playlist deleted successfully");
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      notificationService.error(
        error.message || "Failed to delete playlist",
      );
      if (options.onError) options.onError(error);
    },
    ...options,
  });
};

export const useUpdatePlaylist = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playlistId, data }) =>
      PlaylistService.updatePlaylist(playlistId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: playlistKeys.list() });
      queryClient.invalidateQueries({
        queryKey: playlistKeys.detail(variables.playlistId),
      });
      notificationService.success("Playlist updated successfully");
      if (options.onSuccess) options.onSuccess(data);
    },
    onError: (error) => {
      notificationService.error(
        error.message || "Failed to update playlist",
      );
      if (options.onError) options.onError(error);
    },
    ...options,
  });
}
