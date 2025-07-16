import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/index";
import ModelsPage from "./pages/models";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/models" element={<ModelsPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
