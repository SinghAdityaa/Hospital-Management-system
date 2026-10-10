import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, LockKeyhole, Eye, EyeOff, Stethoscope, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
export default function Login() {
  const { login } = useApp();
  const nav = useNavigate(),
    loc = useLocation();
  const [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [show, setShow] = useState(false),
    [error, setError] = useState('');
  function submit(e) {
    e.preventDefault();
    setError('');
    try {
      login(email, password);
      nav(loc.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <main className="login-screen">
      <div className="login-side">
        <Link className="back-home" to="/">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="login-side-content">
          <h1>Doctor Appointment System</h1>
          <p>Manage appointments, patients and healthcare services in one secure platform.</p>
          <div className="login-doctor" aria-hidden="true">
            <Stethoscope size={112} strokeWidth={1.2} />
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-box card">
          <div className="login-heading">
            <h2>
              <Stethoscope size={27} /> Welcome Back
            </h2>
            <p>Login to your account</p>
          </div>
          <form onSubmit={submit} className="form">
            <label>
              Email
              <div className="with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </label>
            <label>
              Password
              <div className="with-icon">
                <LockKeyhole size={18} />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  title="Show password"
                  className="eye"
                  onClick={() => setShow(!show)}
                >
                  {show ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>
            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" /> Remember Me
              </label>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            {error && <div className="error">{error}</div>}
            <button className="btn btn-primary full" type="submit">
              Login
            </button>
          </form>
          <p className="signup-line">
            New Patient? <Link to="/register">Register Here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
export function ForgotPassword() {
  return (
    <main className="auth-page">
      <div className="card auth-card">
        <h2>Reset password</h2>
        <p className="muted">
          This frontend demo does not send emails. Use a demo account or contact the backend
          developer to implement password recovery.
        </p>
        <Link className="btn btn-primary" to="/login">
          Back to login
        </Link>
      </div>
    </main>
  );
}
