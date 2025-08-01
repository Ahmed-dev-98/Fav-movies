import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check localStorage first, then default to dark
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme) return savedTheme;

        // Default to dark mode
        return "dark";
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Add a small delay to prevent choppy transitions
        const timeoutId = setTimeout(() => {
            // Remove both classes first
            root.classList.remove("light", "dark");

            // Add the current theme class
            root.classList.add(theme);

            // Save to localStorage
            localStorage.setItem("theme", theme);
        }, 10);

        return () => clearTimeout(timeoutId);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    };

    return { theme, toggleTheme };
};