
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
      <ScrollToTop />

      <AppProvider>
        <App />
      </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
