export type ThemePreference = "light" | "dark";

export interface ThemePreferenceStore {
  get(): ThemePreference | null;
  set(theme: ThemePreference): void;
}
