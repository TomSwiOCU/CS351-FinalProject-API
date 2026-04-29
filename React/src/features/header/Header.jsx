// src/features/header/Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header style={{
      background: "#ffffff",
      borderBottom: "1.5px solid #e2e8f0",
      padding: "1rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <div style={{ fontWeight: 700, fontSize: "1.3rem", color: "#1e293b" }}>
        Daily Task Log
      </div>

      <nav style={{ display: "flex", gap: "1.5rem" }}>
        <NavLink 
          to="/tasks" 
          style={({ isActive }) => ({ 
            color: isActive ? "#2563eb" : "#475569",
            textDecoration: "none",
            fontWeight: 500 
          })}
        >
          Tasks
        </NavLink>
        <NavLink 
          to="/lists" 
          style={({ isActive }) => ({ 
            color: isActive ? "#2563eb" : "#475569",
            textDecoration: "none",
            fontWeight: 500 
          })}
        >
          Lists
        </NavLink>
        <NavLink 
          to="/profile" 
          style={({ isActive }) => ({ 
            color: isActive ? "#2563eb" : "#475569",
            textDecoration: "none",
            fontWeight: 500 
          })}
        >
          Profile
        </NavLink>
      </nav>
    </header>
  );
}