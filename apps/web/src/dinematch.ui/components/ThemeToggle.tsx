import { Moon, Sun } from "lucide-react";
import { Button } from "./Button";
import type { Theme } from "../features/theme/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      aria-label={label}
      aria-pressed={isDark}
      className="theme-toggle"
      onClick={onToggle}
      title={label}
      type="button"
      variant="icon"
    >
      {isDark ? (
        <Sun aria-hidden="true" size={18} strokeWidth={2} />
      ) : (
        <Moon aria-hidden="true" size={18} strokeWidth={2} />
      )}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
