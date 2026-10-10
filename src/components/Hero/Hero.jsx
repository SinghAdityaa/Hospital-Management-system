import React from 'react';
import { Link } from 'react-router-dom';
export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="hero-label">HealthCare+ appointment management</span>
          <h1>Book a doctor appointment online</h1>
          <p>
            Find a specialist, request an appointment, and review your booking status from your
            patient dashboard.
          </p>
          <div className="hero-buttons">
            <Link to="/doctors" className="btn btn-primary btn-large">
              Find a doctor
            </Link>
            <Link to="/register" className="btn btn-outline btn-large">
              Register as a patient
            </Link>
          </div>
          <p className="demo-disclaimer">
            Frontend demonstration only. Not a live medical booking service.
          </p>
        </div>
        <div className="hero-illustration">
          <div className="doctor-circle">
            <svg
              viewBox="0 0 420 420"
              role="img"
              aria-label="Illustration of a doctor"
              className="doctor-svg"
            >
              <circle cx="210" cy="210" r="205" fill="#ff5966" />
              <path d="M92 358L114 247L169 221H253L309 247L330 358Z" fill="#fff" />
              <path d="M182 220L211 274L240 220L268 240L245 377H173L155 240Z" fill="#16cbb9" />
              <path d="M195 275L210 315L227 275L216 244H206Z" fill="#087f84" />
              <path
                d="M160 187C152 150 153 110 174 95C195 81 223 86 240 78C275 70 293 95 285 133L281 195Z"
                fill="#636363"
              />
              <path
                d="M164 149Q172 130 183 123Q234 124 263 101Q271 122 271 146V204Q251 246 215 249Q179 248 163 208Z"
                fill="#ffd49d"
              />
              <path d="M167 221L134 239L169 355L187 264Z" fill="#f1f6fa" />
              <path d="M257 221L289 239L250 355L231 264Z" fill="#edf3f7" />
              <path
                d="M154 253Q132 250 129 286V317"
                fill="none"
                stroke="#505c66"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="128" cy="319" r="10" fill="#0b9ca8" />
              <path d="M266 256Q286 256 289 287V312" stroke="#505c66" strokeWidth="6" fill="none" />
              <circle cx="289" cy="322" r="14" fill="none" stroke="#0b9ca8" strokeWidth="7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
