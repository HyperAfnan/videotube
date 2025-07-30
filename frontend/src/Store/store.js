import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";

export const store = configureStore({
  reducer: { auth: authSlice },
});
