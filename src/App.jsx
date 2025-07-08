import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import PdfViewerPage from "./components/PdfViewerPage";
import ChatbotPage from "./components/ChatbotPage";
import "./App.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pdf-viewer" element={<PdfViewerPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
    </Router>
  );
}

export default App;
