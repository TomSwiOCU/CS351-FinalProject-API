// src/features/shell/AppShell.tsx
// @ts-ignore
import Header from '../header/Header.jsx';
// @ts-ignore
import Footer from '../footer/Footer.jsx';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../../core/auth/auth';
import { TaskGroups } from '../lists/TaskGroups';
import './AppShell.css';

export function AppShell() {
  const navigate = useNavigate();
  
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const handleLogout = () => {
    void logout().then(() => navigate('/login', { replace: true }));
  };

  return (
    <div className="shell">
      {/* Header from your partner */}
      <Header />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* Sidebar with Categories */}
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

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
          <Outlet context={{ selectedListId }} />
        </div>
      </div>

      {/* Footer from your partner */}
      <Footer />
    </div>
  );
}