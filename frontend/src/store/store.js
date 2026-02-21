import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "@Features/theme/store/themeSlice.js";

// migrate to redux query
// import watchLaterSlice from "@Features/watchlater/store/watchLaterSlice.js";

// import playlistSlice from "@Features/playlist/store/playlistSlice.js";
// import userSlice from "@Features/user/store/Userslice.js";
// import footerSlice from "@Features/header/store/FooterSlice.js"

export const store = configureStore({
  reducer: {
    // footer: footerSlice,
    // watchLater: watchLaterSlice,
    // playlist: playlistSlice,
    // user: userSlice,
    theme: themeSlice,
  },
});
