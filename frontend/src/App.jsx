import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import SMERegistration from "./components/SMERegistration.jsx";
import Assessment from "./components/Assessment.jsx";
import Inventory from "./components/Inventory.jsx";
import Sales from "./components/Sales.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  // Currently active SME (persisted so it survives refresh)
  const [activeSme, setActiveSme] = useState(() => {
    const saved = localStorage.getItem("activeSme");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (activeSme) localStorage.setItem("activeSme", JSON.stringify(activeSme));
  }, [activeSme]);

  return (
    <BrowserRouter>
      <div className="layout">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-icon">⚡</span>
            <div>
              <div className="brand-title">SME Digi</div>
              <div className="brand-sub">Readiness Platform</div>
            </div>
          </div>

          <div className="nav-section">Main Menu</div>
          <NavLink to="/" end className="nav-link">Dashboard</NavLink>
          <NavLink to="/registration" className="nav-link">SME Registration</NavLink>
          <NavLink to="/assessment" className="nav-link">Digital Readiness Assessment</NavLink>

          <div className="nav-section">Business Tools</div>
          <NavLink to="/inventory" className="nav-link">Inventory</NavLink>
          <NavLink to="/sales" className="nav-link">Sales</NavLink>

          {activeSme && (
            <div className="active-sme">
              Active SME<br /><strong>{activeSme.sme_name}</strong>
            </div>
          )}
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard activeSme={activeSme} />} />
            <Route
              path="/registration"
              element={<SMERegistration onRegistered={setActiveSme} />}
            />
            <Route
              path="/assessment"
              element={<Assessment activeSme={activeSme} />} />
            <Route path="/inventory" element={<Inventory activeSme={activeSme} />} />
            <Route path="/sales" element={<Sales activeSme={activeSme} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
