import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  FlaskConical,
  Pill,
  Users,
  ClipboardList,
  HeartPulse,
  Home,
  UserRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
const items = {
  patient: [
    ['/dashboard', 'Overview', LayoutDashboard],
    ['/dashboard/appointments', 'My appointments', CalendarDays],
    ['/dashboard/reports', 'Lab reports', FlaskConical],
    ['/dashboard/prescriptions', 'Prescriptions', Pill],
    ['/dashboard/profile', 'My profile', UserRound],
  ],
  doctor: [
    ['/dashboard', 'Overview', LayoutDashboard],
    ['/dashboard/appointments', 'Appointments', CalendarDays],
    ['/dashboard/prescriptions', 'Prescriptions', Pill],
  ],
  admin: [
    ['/dashboard', 'Overview', LayoutDashboard],
    ['/dashboard/doctors', 'Manage doctors', Stethoscope],
    ['/dashboard/patients', 'Patients', Users],
    ['/dashboard/appointments', 'Appointments', CalendarDays],
  ],
  reception: [
    ['/dashboard', 'Overview', LayoutDashboard],
    ['/dashboard/appointments', 'Manage appointments', ClipboardList],
    ['/dashboard/patients', 'Patient list', Users],
  ],
  lab: [
    ['/dashboard', 'Overview', LayoutDashboard],
    ['/dashboard/reports', 'Lab reports', FlaskConical],
  ],
  pharmacy: [
    ['/dashboard', 'Overview', LayoutDashboard],
    ['/dashboard/prescriptions', 'Prescriptions', Pill],
  ],
};
export default function Sidebar() {
  const { user } = useApp();
  return (
    <aside className="dashboard-sidebar">
      <Link className="brand" to="/">
        <HeartPulse /> HealthCare+
      </Link>
      <div className="side-user">
        <div className="side-avatar">{user?.firstName?.[0]}</div>
        <strong>
          {user?.firstName} {user?.lastName}
        </strong>
        <span>{user?.role}</span>
      </div>
      <nav>
        <Link className="side-link" to="/">
          <Home size={19} /> Website
        </Link>
        {(items[user?.role] || []).map(([href, label, Icon]) => (
          <NavLink
            end={href === '/dashboard'}
            key={href}
            to={href}
            className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
