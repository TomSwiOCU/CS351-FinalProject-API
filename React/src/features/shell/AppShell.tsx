// src/features/shell/AppShell.tsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../../core/auth/auth';
import { TaskGroups } from '../lists/TaskGroups';
import './AppShell.css';

export function AppShell() {
  const navigate = useNavigate();
  
  // State shared with TasksPage via Outlet context
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const handleLogout = () => {
    void logout().then(() => navigate('/login', { replace: true }));
  };

  return (
    <div className="shell">
      {/* Top navigation bar */}
      <header className="topbar">
        <div className="brand">Daily Task Log</div>
        <nav>
          <NavLink to="/tasks" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Tasks
          </NavLink>
          <NavLink to="/lists" className={({ isActive }) => (isActive ? 'active' : '')}>
            Lists
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
            Profile
          </NavLink>
        </nav>
        <button type="button" className="ghost" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Grouping Component */}
        <div style={{ 
          width: '320px', 
          borderRight: '1.5px solid #e2e8f0', 
          background: '#f8fafc', 
          overflowY: 'auto', 
          padding: '1.5rem' 
        }}>
          <TaskGroups 
            selectedListId={selectedListId} 
            onSelectList={setSelectedListId} 
          />
        </div>

        {/* Main Content Area - Renders TasksPage, ListsPage, etc. */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
          <Outlet context={{ selectedListId }} />
        </div>
      </div>
    </div>
  );
}