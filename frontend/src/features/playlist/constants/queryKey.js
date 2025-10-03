export const playlistKeys = {
  all: ['playlists'],
  list: () => [...playlistKeys.all, 'list'],
  detail: (id) => [...playlistKeys.all, 'detail', id],
};
