import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
const fields = [
  ['First Name', 'firstName', 'text', true],
  ['Last Name', 'lastName', 'text', true],
  ['Gender', 'gender', 'select', true, ['Male', 'Female', 'Other', 'Prefer not to say']],
  ['Date of Birth', 'dob', 'date', true],
  [
    'Blood Group',
    'bloodGroup',
    'select',
    false,
    ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  ],
  ['Email', 'email', 'email', true],
  ['Phone', 'phone', 'tel', true],
  ['Emergency Contact', 'emergencyContact', 'tel'],
  ['Address', 'address', 'textarea'],
  ['City', 'city', 'text'],
  ['State', 'state', 'text'],
  ['Country', 'country', 'text'],
  ['Pincode', 'pincode', 'text'],
  ['Password', 'password', 'password', true],
  ['Confirm Password', 'confirmPassword', 'password', true],
];
export default function Register() {
  const [values, setValues] = useState({}),
    [error, setError] = useState('');
  const { register } = useApp();
  const nav = useNavigate();
  const onChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  function submit(e) {
    e.preventDefault();
    setError('');
    if (values.password !== values.confirmPassword) return setError('Passwords do not match');
    if ((values.password || '').length < 8)
      return setError('Password must be at least 8 characters');
    if (!/^\d{10}$/.test(values.phone || ''))
      return setError('Phone number must contain 10 digits');
    try {
      const { confirmPassword, ...data } = values;
      register(data);
      nav('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <main className="register-screen">
      <div className="register-card card">
        <header className="register-title">
          <h2>Patient Registration</h2>
          <p>Create your account to book appointments.</p>
        </header>
        <form className="register-grid form" onSubmit={submit}>
          {fields.map(([label, name, type, required, options]) => (
            <label
              key={name}
              className={['bloodGroup', 'email', 'address'].includes(name) ? 'wide' : ''}
            >
              {label} {required && <span>*</span>}
              {type === 'select' ? (
                <select
                  required={!!required}
                  name={name}
                  value={values[name] || ''}
                  onChange={onChange}
                >
                  <option value="">Select {label}</option>
                  {options.map((o) => (
                    <option value={o} key={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : type === 'textarea' ? (
                <textarea
                  rows="3"
                  name={name}
                  placeholder={label}
                  value={values[name] || ''}
                  onChange={onChange}
                />
              ) : (
                <input
                  required={!!required}
                  type={type}
                  name={name}
                  placeholder={label}
                  value={values[name] || ''}
                  onChange={onChange}
                />
              )}
            </label>
          ))}
          {error && <div className="error wide">{error}</div>}
          <button type="submit" className="btn btn-primary wide full">
            Register
          </button>
        </form>
        <p className="signup-line">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <p className="center">
          <Link to="/" className="muted">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
