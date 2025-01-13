import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TabelaProdutos from "./components/TabelaProdutos";
import './App.css'
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tabela" element={<TabelaProdutos />} />
      </Routes>
    </Router>
  );
}

export default App
