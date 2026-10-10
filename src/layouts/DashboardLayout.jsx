import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import { LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
export default function DashboardLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <div className="dash-header">
          <div>
            <small className="muted">HealthCare+ Management</small>
            <strong>{user?.role?.toUpperCase()} PORTAL</strong>
          </div>
          <button
            className="btn btn-soft"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
