import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon size={19} strokeWidth={1.8} />
      ) : (
        <Sun size={19} strokeWidth={1.8} />
      )}
    </button>
  );
}

export default ThemeToggle;
