import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@Features/auth/store/authSlice.js";
import themeSlice from "@Features/theme/store/themeSlice.js";

// migrate to redux query
// import watchLaterSlice from "@Features/watchlater/store/watchLaterSlice.js";

import playlistSlice from "@Features/playlist/store/playlistSlice.js";
import videoSlice from "@Features/video/store/videoSlice.js";
import userSlice from "@Features/user/store/Userslice.js";
// import footerSlice from "@Features/header/store/FooterSlice.js"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    // footer: footerSlice,
    // watchLater: watchLaterSlice,
    playlist: playlistSlice,
    video: videoSlice,
    user: userSlice,
    theme: themeSlice,
  },
});
