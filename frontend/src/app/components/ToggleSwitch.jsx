import { React, useEffect } from "react";
import "../../styles/ToggleSwitch.css";

export default function ToggleSwitch({ isOn, handleToggle, persistKey = "autoSaveEnabled" }) {
  // Optional localStorage support
  useEffect(() => {
    const saved = localStorage.getItem(persistKey);
    if (saved !== null) {
      const value = saved === "true";
      if (value !== isOn) {
        handleToggle(value);
      }
    }
  }, [persistKey]);

  useEffect(() => {
    localStorage.setItem(persistKey, isOn);
  }, [isOn, persistKey]);

  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        checked={isOn}
        onChange={() => handleToggle(!isOn)}
        id={`toggle-${persistKey}`}
        className="toggle-checkbox"
      />
      <label className="toggle-label" htmlFor={`toggle-${persistKey}`} />
    </div>
  );
}