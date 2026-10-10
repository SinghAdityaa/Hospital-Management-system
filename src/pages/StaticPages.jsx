import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import {
  CalendarDays,
  FlaskConical,
  Stethoscope,
  Pill,
  ShieldCheck,
  HeartHandshake,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
const entries = [
  ['Doctor Consultations', 'Find specialists and book consultations.', Stethoscope],
  ['Online Appointments', 'Schedule and track appointment status.', CalendarDays],
  ['Laboratory Management', 'Request, manage and access lab reports.', FlaskConical],
  ['Pharmacy', 'Track prescriptions and dispensing workflow.', Pill],
  ['Role-Based Access', 'Different portals for each healthcare role.', ShieldCheck],
  ['Patient Care', 'Keep key patient information organized.', HeartHandshake],
];
export function About() {
  return (
    <>
      <Navbar />
      <main className="section container readable">
        <span className="eyebrow">ABOUT US</span>
        <h1>About HealthCare+</h1>
        <p className="lead">
          HealthCare+ is a doctor appointment and healthcare management frontend designed to make
          daily tasks easier for patients, doctors, reception teams, laboratories, pharmacies and
          administrators.
        </p>
        <div className="about-panel card">
          <h2>Designed for multiple healthcare roles.</h2>
          <p>
            Patients can find doctors, request appointments, view reports and prescriptions.
            Healthcare staff get their own dashboards for managing workflows. This project is a
            frontend demonstration; no real patient data should be entered.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
export function Services() {
  return (
    <>
      <Navbar />
      <main className="section container">
        <div className="section-title">
          <span className="eyebrow">WHAT WE OFFER</span>
          <h1>Our Services</h1>
          <p>Explore the HealthCare+ experience.</p>
        </div>
        <div className="feature-grid">
          {entries.map(([name, desc, Icon]) => (
            <div key={name} className="feature card">
              <div className="feature-icon">
                <Icon />
              </div>
              <h3>{name}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
export function Contact() {
  const [sent, setSent] = React.useState(false);
  return (
    <>
      <Navbar />
      <main className="section container">
        <div className="section-title">
          <span className="eyebrow">CONTACT</span>
          <h1>Get in touch</h1>
          <p>Questions about our sample system? Send a demonstration message.</p>
        </div>
        <div className="contact-grid">
          <div className="card pad">
            <h2>Contact information</h2>
            <p>Contact details will be published after deployment.</p>
            <small className="muted">
              Demo contact information, not an active healthcare service.
            </small>
          </div>
          <form
            className="card pad form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              e.currentTarget.reset();
            }}
          >
            <label>
              Full name
              <input required placeholder="Your name" />
            </label>
            <label>
              Email
              <input required type="email" placeholder="you@example.com" />
            </label>
            <label>
              Message
              <textarea required rows="5" placeholder="How can we help?" />
            </label>
            <button className="btn btn-primary">Send message</button>
            {sent && <p className="success">Demo message received locally. No message was sent.</p>}
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
