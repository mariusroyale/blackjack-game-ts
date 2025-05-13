import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Add router imports
import App from "./App.jsx";
import Leaderboards from "./Leaderboards.jsx";
import "../styles/App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} /> {/* Main page */}
      <Route path="/leaderboards" element={<Leaderboards />} /> {/* Leaderboards page */}
    </Routes>
  </Router>
);