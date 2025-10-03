import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheme } from "../store/themeSlice.js";

export default function ThemeInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const getInitialTheme = () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = localStorage.getItem("videotube-theme");
        if (storedTheme) return storedTheme;
      }

      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
      }

      return "light";
    };

    dispatch(setTheme(getInitialTheme()));

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newTheme = e.matches ? "dark" : "light";
      if (!localStorage.getItem("videotube-theme")) {
        dispatch(setTheme(newTheme));
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [dispatch]);

  return children;
}
