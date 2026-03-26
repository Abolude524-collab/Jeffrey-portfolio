"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type ThemeMode = "dark" | "light";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<ThemeMode>("dark");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as ThemeMode | null;
        if (storedTheme) {
            setTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("dark", "light");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-700 text-slate-300 hover:text-accent-emerald hover:border-accent-emerald transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-sm font-medium">{isDark ? "Light mode" : "Dark mode"}</span>
        </button>
    );
}
