import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "@lacquer/core/bindings/html.theme.css";
import "./site.css";
import { EntryPage } from "./EntryPage.tsx";
import { Index } from "./Index.tsx";
import { Layout } from "./Layout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Index />} />
          <Route path=":id" element={<EntryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
