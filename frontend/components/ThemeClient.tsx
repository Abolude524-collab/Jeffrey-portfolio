"use client";

import { useEffect } from "react";

type ThemeMode = "dark" | "light";

export default function ThemeClient() {
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as ThemeMode | null;
        const theme: ThemeMode = storedTheme || "dark";
        const root = document.documentElement;
        root.classList.remove("dark", "light");
        root.classList.add(theme);
    }, []);

    return null;
}
