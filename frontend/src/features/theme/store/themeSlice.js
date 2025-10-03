import { createSlice } from "@reduxjs/toolkit";

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = localStorage.getItem("videotube-theme");
    if (storedTheme) return storedTheme;
  }

  // Check system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
  }

  return "light"; // Default theme
};

const initialState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;

      // Update localStorage and document classes when theme changes
      if (typeof window !== 'undefined') {
        localStorage.setItem("videotube-theme", action.payload);
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(action.payload);
        root.setAttribute("data-theme", action.payload);
      }
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      state.theme = newTheme;

      // Update localStorage and document classes when theme changes
      if (typeof window !== 'undefined') {
        localStorage.setItem("videotube-theme", newTheme);
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
        root.setAttribute("data-theme", newTheme);
      }
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
