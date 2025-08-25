import { createSlice } from "@reduxjs/toolkit";
const initialState = { videos: [] };

const video = createSlice({
   name: "videos",
   initialState,
   reducers: {
      /* Simple reducer to add video data into redux state when the videos are fetched initially */
      setVideos: (state, action) => { state.videos = action.payload; },

      // TODO: add this to the report option
      /* Simple reducer to rmeove video from home when the user clicks on the report option */
      removeSingleVideo: (state, action) => { state.videos = state.videos.filter((video) => video._id !== action.payload); },

      /* Simple reducer to add more videos after lazy loading  */
      setMoreVideos: (state, action) => { state.videos = [...state.videos, ...action.payload]; },
   },
});

export const { setVideos, clearWatchLater, setMoreVideos } = video.actions;
export default video.reducer;
