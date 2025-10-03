import { useDispatch, useSelector } from "react-redux";
import { setTheme, toggleTheme } from "../store/themeSlice.js";
import { useEffect } from "react";

export function useThemeRedux() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme?.theme);

  const updateTheme = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  const switchTheme = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    if (!theme) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    root.setAttribute("data-theme", theme);
  }, [theme]);

  return {
    theme,
    setTheme: updateTheme,
    toggleTheme: switchTheme,
    isDark: theme === "dark",
    isLight: theme === "light"
  };
}
