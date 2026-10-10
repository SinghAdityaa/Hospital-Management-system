import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Mail, Phone, MapPin } from 'lucide-react';
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand" to="/">
            <HeartPulse /> HealthCare+
          </Link>
          <p>Doctor appointments and healthcare workflows in one interface.</p>
        </div>
        <div>
          <h4>Quick links</h4>
          <Link to="/">Home</Link>
          <Link to="/doctors">Find doctors</Link>
          <Link to="/services">Services</Link>
        </div>
        <div>
          <h4>Support</h4>
          <Link to="/contact">Contact us</Link>
          <Link to="/about">About us</Link>
          <Link to="/login">Login</Link>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms and conditions</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p>Frontend demonstration. Contact details pending deployment.</p>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} HealthCare+. Frontend demonstration only.
      </div>
    </footer>
  );
}
