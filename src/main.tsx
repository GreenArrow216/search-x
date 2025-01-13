import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.scss";
import Home from "./pages/home/Home";
import Results from "./pages/results/Results";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/:id" element={<Results />} />
    </Routes>
  </BrowserRouter>
  </StrictMode>
);
