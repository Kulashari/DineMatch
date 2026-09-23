import type {
  ThemePreference,
  ThemePreferenceStore,
} from "../../dinematch.application/theme/ThemePreferenceStore";

const THEME_STORAGE_KEY = "dinematch-theme";

export class LocalStorageThemePreferenceStore implements ThemePreferenceStore {
  get(): ThemePreference | null {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
  }

  set(theme: ThemePreference) {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
