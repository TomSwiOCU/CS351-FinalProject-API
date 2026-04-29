// src/features/header/Header.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../core/auth/auth";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

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

      <button 
        onClick={handleLogout}
        style={{
          background: "#ef4444",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 500
        }}
      >
        Log out
      </button>
    </header>
  );
}