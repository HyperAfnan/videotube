import { createSlice } from "@reduxjs/toolkit";
const initialState = { status: false, userMeta: null, accessToken: null };

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setCredentials: (state, action) => {
         state.status = true;
         state.userMeta = action.payload.userMeta;
         state.accessToken = action.payload.accessToken;
      },
      clearCredentials: (state) => {
         state.status = false;
         state.userMeta = null;
         state.accessToken = null;
      },
   },
});

export const {
   setCredentials: setCredentials,
   clearCredentials: clearCredentials,
} = authSlice.actions;
export default authSlice.reducer;
