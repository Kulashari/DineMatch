import { useEffect, useState } from "react";
import type {
  ThemePreference,
  ThemePreferenceStore,
} from "../../../dinematch.application/theme/ThemePreferenceStore";

export type Theme = ThemePreference;

function getInitialTheme(store: ThemePreferenceStore): Theme {
  const storedTheme = store.get();

  return storedTheme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");
}

export function useTheme(store: ThemePreferenceStore) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme(store));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    store.set(theme);
  }, [store, theme]);

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  }

  return { theme, toggleTheme };
}
