import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useApp } from '../context/AppContext';
export default function BookAppointment() {
  const { id } = useParams();
  const { doctors, user, addAppointment } = useApp();
  const doc = doctors.find((d) => d.id === id);
  const [date, setDate] = useState(''),
    [time, setTime] = useState(''),
    [reason, setReason] = useState(''),
    [error, setError] = useState('');
  const nav = useNavigate();
  if (!doc)
    return (
      <div className="section container">
        Doctor not found. <Link to="/doctors">Browse doctors</Link>
      </div>
    );
  function submit(e) {
    e.preventDefault();
    if (!user) {
      nav('/login', { state: { from: { pathname: '/book/' + id } } });
      return;
    }
    if (user.role !== 'patient') {
      setError('Please sign in using a patient account to book an appointment');
      return;
    }
    addAppointment({
      doctorId: doc.id,
      doctorName: doc.name,
      specialization: doc.specialization,
      patientId: user.id,
      patientName: user.firstName + ' ' + user.lastName,
      date,
      time,
      reason,
    });
    nav('/dashboard/appointments', { state: { success: 'Appointment requested!' } });
  }
  return (
    <>
      <Navbar />
      <main className="section container booking-page">
        <div className="section-title">
          <span className="eyebrow">BOOK AN APPOINTMENT</span>
          <h1>Schedule your visit</h1>
          <p>Choose an available request date and time.</p>
        </div>
        <div className="booking-grid">
          <div className="card pad">
            <div className="doctor-avatar large">{doc.icon}</div>
            <h2>{doc.name}</h2>
            <p className="specialty">{doc.specialization}</p>
            <p>{doc.bio}</p>
            <p>
              <strong>Experience:</strong> {doc.experience} years
            </p>
            <p>
              <strong>Working hours:</strong> {doc.time}
            </p>
            <p>
              <strong>Days:</strong> {doc.days}
            </p>
            <p>
              <strong>Consultation:</strong> ₹{doc.fee}
            </p>
          </div>
          <form className="card pad form" onSubmit={submit}>
            <h2>Appointment details</h2>
            <label>
              Preferred date
              <input
                required
                type="date"
                min={new Date().toLocaleDateString('en-CA')}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label>
              Preferred time
              <select required value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">Select time</option>
                {[
                  '09:00',
                  '09:30',
                  '10:00',
                  '10:30',
                  '11:00',
                  '11:30',
                  '12:00',
                  '12:30',
                  '14:00',
                  '14:30',
                  '15:00',
                  '15:30',
                  '16:00',
                  '16:30',
                  '17:00',
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Reason for visit
              <textarea
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder="Briefly describe your concern"
              />
            </label>
            <p className="muted text-small">
              This is a preferred slot request, not confirmed availability. Reception will confirm
              it in the demo portal.
            </p>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary full">Request Appointment</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
