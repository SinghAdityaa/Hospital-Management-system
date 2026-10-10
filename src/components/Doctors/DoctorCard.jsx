import React from 'react';
import { CalendarDays, Clock3, IndianRupee, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function DoctorCard({ doctor }) {
  return (
    <article className="doctor-card card">
      <div className="doctor-avatar" aria-hidden="true">
        <Stethoscope size={30} strokeWidth={1.5} />
      </div>
      <div className="doctor-info">
        <div className="doctor-top">
          <h3>{doctor.name}</h3>
        </div>
        <span className="specialty">{doctor.specialization}</span>
        <p className="muted">{doctor.bio || 'Consultation details'}</p>
        <div className="doctor-meta">
          <span>
            <Clock3 size={15} /> {doctor.experience} years experience
          </span>
          <span>
            <CalendarDays size={15} /> {doctor.days}
          </span>
          <span>
            <IndianRupee size={15} /> ₹{doctor.fee} / visit
          </span>
        </div>
        <Link className="btn btn-primary full" to={'/book/' + doctor.id}>
          Book appointment
        </Link>
      </div>
    </article>
  );
}
