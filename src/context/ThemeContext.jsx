import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      console.log("Initial theme from localStorage:", saved);
      // If nothing saved, default to light
      return saved || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    console.log("Theme changed to:", theme);
    
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("Could not save theme:", error);
    }

    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove("dark", "light");
    
    // Add the current theme
    root.classList.add(theme);
    
    console.log("HTML classes:", root.classList.toString());
  }, [theme]);

  const toggleTheme = () => {
    console.log("Toggle clicked! Current theme:", theme);
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      console.log("New theme:", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}