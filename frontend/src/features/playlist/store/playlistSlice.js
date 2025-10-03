import { createSlice } from "@reduxjs/toolkit";
const initialState = { playlists: [] };

const playlist = createSlice({
   name: "playlists",
   initialState,
   reducers: {
      /* Simple reducer to add video data into redux state when the videos are fetched initially */
      setPlaylists: (state, action) => { state.playlists = action.payload; },

      /* remove a playlist from the user's playlist page  */
      removeSinglePlaylist: (state, action) => { state.playlists = state.playlists.filter((playlist) => playlist._id !== action.payload); },
   },
});

export const { setPlaylists, removeSinglePlaylist } = playlist.actions;
export default playlist.reducer;
