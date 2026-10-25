import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useApp } from '../context/AppContext';

const SLOT_MINUTES = 30;
const BREAK = [13 * 60, 14 * 60]; // lunch 1 PM to 2 PM. Set to null for no break.

function toMinutes(text) {
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(text || '');
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') h += 12;
  return h * 60 + Number(m[2]);
}

// "10:00 AM to 4:00 PM" -> [600, 960]
function parseHours(text) {
  const parts = String(text || '').split(/\s+to\s+/i);
  const start = toMinutes(parts[0]);
  const end = toMinutes(parts[1]);
  return start !== null && end !== null && end > start ? [start, end] : [9 * 60, 17 * 60];
}

const pad = (n) => String(n).padStart(2, '0');
const to24 = (mins) => pad(Math.floor(mins / 60)) + ':' + pad(mins % 60);

function to12(mins) {
  const h = Math.floor(mins / 60);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return (h % 12 || 12) + ':' + pad(mins % 60) + ' ' + suffix;
}

function buildSlots(workingHours) {
  const [start, end] = parseHours(workingHours);
  const slots = [];
  for (let t = start; t + SLOT_MINUTES <= end; t += SLOT_MINUTES) {
    if (BREAK && t >= BREAK[0] && t < BREAK[1]) continue;
    slots.push({
      start: t,
      value: to24(t), // saved as appointment.time, e.g. "11:00"
      endValue: to24(t + SLOT_MINUTES),
      label: to12(t) + ' - ' + to12(t + SLOT_MINUTES),
    });
  }
  return slots;
}

export default function BookAppointment() {
  const { id } = useParams();
  const { doctors, user, appointments, addAppointment } = useApp();
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

  const today = new Date().toLocaleDateString('en-CA');
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots = buildSlots(doc.time);

  // Slots already taken for this doctor on the chosen date
  const booked = new Set(
    (appointments || [])
      .filter((a) => a.doctorId === doc.id && a.date === date && a.status !== 'Cancelled')
      .map((a) => a.time)
  );

  const isPast = (slot) => date === today && slot.start <= nowMinutes;

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
    if (!time) {
      setError('Please select a time slot.');
      return;
    }
    if (booked.has(time)) {
      setError('Sorry, this slot was just booked. Please choose another.');
      setTime('');
      return;
    }
    const slot = slots.find((s) => s.value === time);
    addAppointment({
      doctorId: doc.id,
      doctorName: doc.name,
      specialization: doc.specialization,
      patientId: user.id,
      patientName: user.firstName + ' ' + user.lastName,
      date,
      time,
      endTime: slot ? slot.endValue : '',
      reason,
    });
    nav('/dashboard/appointments', { state: { success: 'Appointment booked!' } });
  }

  return (
    <>
      <Navbar />
      <main className="section container booking-page">
        <div className="section-title">
          <span className="eyebrow">BOOK AN APPOINTMENT</span>
          <h1>Schedule your visit</h1>
          <p>Pick a date, then choose a free 30-minute slot.</p>
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
              Date
              <input
                required
                type="date"
                min={today}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime('');
                  setError('');
                }}
              />
            </label>

            <div>
              <strong>Time slot</strong>
              {!date ? (
                <p className="muted text-small">Select a date to see available slots.</p>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                    gap: '8px',
                    marginTop: '8px',
                  }}
                >
                  {slots.map((slot) => {
                    const taken = booked.has(slot.value);
                    const past = isPast(slot);
                    const disabled = taken || past;
                    const selected = time === slot.value;
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setTime(slot.value);
                          setError('');
                        }}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '8px',
                          border: '1px solid ' + (selected ? '#1671c9' : 'rgba(128,128,128,0.45)'),
                          background: selected ? '#1671c9' : 'transparent',
                          color: selected ? '#fff' : 'inherit',
                          opacity: disabled ? 0.4 : 1,
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          textDecoration: taken ? 'line-through' : 'none',
                          font: 'inherit',
                        }}
                      >
                        {slot.label}
                        {taken ? ' (Booked)' : ''}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

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
              Your appointment is confirmed as soon as you book a free slot.
            </p>
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary full">Book Appointment</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}