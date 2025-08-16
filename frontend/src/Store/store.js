import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import footerSlice from "./authSlice.js";
import watchLaterSlice from "./watchLaterSlice.js";

export const store = configureStore({
   reducer: {
      auth: authSlice,
      footer: footerSlice,
      watchLater: watchLaterSlice,
   },
});
