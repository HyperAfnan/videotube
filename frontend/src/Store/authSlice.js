import { createSlice } from "@reduxjs/toolkit";
const initialState = {
   status: false,
   userMeta: {
      username: null,
      _id: null,
      avatar: null,
      coverImage: null,
      fullname: null,
      email: null,
      playlists: [],
      videos: [],
      tweets: [],
      watchHistory: [],
      subscribers: [],
      subscriptions: [],
   },
   accessToken: null,
};

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setCredentials: (state, action) => {
         state.status = true;
         state.accessToken = action.payload.accessToken;
         state.userMeta = {
            username: action.payload.userMeta.username,
            _id: action.payload.userMeta._id,
            avatarUrl: action.payload.userMeta.avatarUrl,
            coverImage: action.payload.userMeta.coverImage,
            email: action.payload.userMeta.email,
            fullname: action.payload.userMeta.fullname,
            playlists: action.payload.userMeta.playlists,
            videos: action.payload.userMeta.videos,
            tweets: action.payload.userMeta.tweets,
            watchHistory: action.payload.userMeta.watchHistory,
            subscribers: action.payload.userMeta.subscribers,
            subscriptions: action.payload.userMeta.subscriptions,
         };
      },
      clearCredentials: (state) => {
         state.status = false;
         state.accessToken = null;
         state.userMeta = {
            username: null,
            _id: null,
            avatarUrl: null,
            coverImage: null,
            email: null,
            playlists: null,
            videos: null,
            tweets: null,
            watchHistory: null,
            subscribers: null,
            subscriptions: null,
         };
      },
   },
});

export const {
   setCredentials: setCredentials,
   clearCredentials: clearCredentials,
} = authSlice.actions;
export default authSlice.reducer;
