import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  preferences: {},
  subscription: null,
  history: [],
  likes: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfileField: (state, action) => {
      const { field, value } = action.payload;
      state.profile = { ...state.profile, [field]: value };
    },
    clearProfile: (state) => {
      state.profile = null;
    },

    setPreferences: (state, action) => {
      state.preferences = action.payload;
    },
    updatePreference: (state, action) => {
      const { key, value } = action.payload;
      state.preferences[key] = value;
    },

    setSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    clearSubscription: (state) => {
      state.subscription = null;
    },

    setWatchHistory: (state, action) => {
      state.history = action.payload;
    },
    addToHistory: (state, action) => {
      state.history.push(action.payload);
    },
    clearWatchHistory: (state) => {
      state.history = [];
    },

    setLikedVideos: (state, action) => {
      state.likes = action.payload;
    },
    addLike: (state, action) => {
      state.likes.push(action.payload);
    },
    removeLike: (state, action) => {
      state.likes = state.likes.filter((id) => id !== action.payload);
    },

  },
});

export const {
  setProfile,
  updateProfileField,
  clearProfile,
  setPreferences,
  updatePreference,
  setSubscription,
  clearSubscription,
  setWatchHistory,
  addToHistory,
  clearWatchHistory,
  setLikedVideos,
  addLike,
  removeLike,
} = userSlice.actions;

export default userSlice.reducer;
