import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, HeartPulse } from 'lucide-react';
import { useApp } from '../../context/AppContext';
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/" onClick={close}>
          <HeartPulse size={25} /> HealthCare<span>+</span>
        </Link>
        <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          <NavLink onClick={close} to="/">
            Home
          </NavLink>
          <NavLink onClick={close} to="/about">
            About
          </NavLink>
          <NavLink onClick={close} to="/services">
            Services
          </NavLink>
          <NavLink onClick={close} to="/doctors">
            Doctors
          </NavLink>
          <NavLink onClick={close} to="/contact">
            Contact
          </NavLink>
        </nav>
        <div className={open ? 'nav-actions open' : 'nav-actions'}>
          {user ? (
            <>
              <Link className="btn btn-outline" to="/dashboard" onClick={close}>
                Dashboard
              </Link>
              <button
                className="btn btn-primary"
                onClick={() => {
                  logout();
                  close();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline" to="/login" onClick={close}>
                Login
              </Link>
              <Link className="btn btn-primary" to="/register" onClick={close}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
