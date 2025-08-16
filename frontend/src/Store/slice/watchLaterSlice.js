import { createSlice } from "@reduxjs/toolkit";
const initialState = { watchList: [] };

const watchLater = createSlice({
   name: "watchLater",
   initialState,
   reducers: {
      setWatchLater: (state, action) => {
         state.watchList = action.payload;
      },
      removeWatchLater: (state, action) => {
         state.watchList = state.watchList.filter( (list) => list._id !== action.payload);
      },
      clearWatchLater: (state) => {
         state.watchList = [];
      },
      addSingleWatchLater: (state, action) => {
         const watchLaterEntryExists = state.watchList.some(
            (watchLater) => watchLater._id === action.payload._id,
         );
         if (!watchLaterEntryExists) state.watchList.push(action.payload);
      },
   },
});

export const {
   setWatchLater,
   removeWatchLater,
   clearWatchLater,
   addSingleWatchLater,
} = watchLater.actions;
export default watchLater.reducer;
