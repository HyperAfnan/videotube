import { createSlice } from "@reduxjs/toolkit";
const initialState = { status: false, userMeta: null };

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      login: (state, action) => {
         state.status = true;
         state.userMeta = action.payload;
      },
      logout: (state) => {
         state.status = false;
         state.userMeta = null;
      },
   },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
