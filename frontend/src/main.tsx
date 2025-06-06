import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventFinderProvider } from "./context/provider.tsx";
import { CombinedView } from "./Combined.tsx";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <EventFinderProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/map" element={<CombinedView />} />
        </Routes>
      </EventFinderProvider>
    </BrowserRouter>
  </StrictMode>
);
