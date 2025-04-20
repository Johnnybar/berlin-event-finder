import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { EventMap } from "./EventMap.tsx"
import { Dashboard } from "./Dashboard.tsx"
import { EventFinderProvider } from "./context/provider.tsx"

import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <EventFinderProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/map" element={<EventMap />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </EventFinderProvider>
    </BrowserRouter>
  </StrictMode>,
)
