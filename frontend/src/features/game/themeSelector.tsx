import { useState, useEffect } from "react";

export default function ThemeSelector() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Read from localStorage on initial load
        const saved = localStorage.getItem("theme");
        
        if (saved) {
            setIsDark(saved === "dark");
        } else {
            setIsDark(document.body.classList.contains("dark-theme"));
        }
    }, []);

    useEffect(() => {
        if (isDark) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <div className="theme-selector">
        <div
            className={`theme-box light ${!isDark ? "selected" : ""}`}
            onClick={() => setIsDark(false)}
            title="Light Theme"
        ></div>
        <div
            className={`theme-box dark ${isDark ? "selected" : ""}`}
            onClick={() => setIsDark(true)}
            title="Dark Theme"
        ></div>
        </div>
    );
}