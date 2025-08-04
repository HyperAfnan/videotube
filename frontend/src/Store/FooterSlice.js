import { createSlice } from "@reduxjs/toolkit";
const initialState = { isClosed: false };

const footerSlice = createSlice({
   name: "footer",
   initialState,
   reducers: {
      closeFooter: (state ) => {
         state.isClosed = true
      },
   },
});

export const { closeFooter } = footerSlice.actions;
export default footerSlice.reducer;
