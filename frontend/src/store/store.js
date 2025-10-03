import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@Features/auth/store/authSlice.js"
import watchLaterSlice from "@Features/watchlater/store/watchLaterSlice.js"
import footerSlice from "@Features/header/store/FooterSlice.js"

export const store = configureStore({
   reducer: {
      auth: authSlice,
      footer: footerSlice,
      watchLater: watchLaterSlice,
   },
});
