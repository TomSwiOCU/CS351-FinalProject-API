import React from "react";

export default function Header() {
  return (
    <header className="header">
      <h1>Task Journal App</h1>

      <nav>
        <a href="#">Dashboard</a>
        <a href="#">Tasks</a>
        <a href="#">Lists</a>
        <a href="#">Groups</a>
      </nav>
    </header>
  );
}