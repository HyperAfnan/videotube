import { configureStore } from "@reduxjs/toolkit";
import { authSlice, footerSlice, watchLaterSlice } from "@Store/slice";

export const store = configureStore({
   reducer: {
      auth: authSlice,
      footer: footerSlice,
      watchLater: watchLaterSlice,
   },
});
