import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  CalendarDays,
  ClipboardPlus,
  ShieldCheck,
  ArrowRight,
  Clock3,
  Stethoscope,
} from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Hero from '../components/Hero/Hero';
import DoctorCard from '../components/Doctors/DoctorCard';
import { useApp } from '../context/AppContext';
const services = [
  {
    title: 'Easy Appointments',
    desc: 'Find the right specialist and request an appointment in a few clicks.',
    icon: CalendarDays,
  },
  {
    title: 'Lab Reports',
    desc: 'Manage patient diagnostic requests and view completed reports.',
    icon: ClipboardPlus,
  },
  {
    title: 'Expert Doctors',
    desc: 'Browse specialists and see their consultation details.',
    icon: Stethoscope,
  },
  {
    title: 'Secure Experience',
    desc: 'Separate user experiences for every healthcare team.',
    icon: ShieldCheck,
  },
];
export default function Home() {
  const { doctors } = useApp();
  return (
    <>
      <Navbar />
      <Hero />
      <section className="section container" id="services">
        <div className="section-title">
          <span className="eyebrow">OUR SERVICES</span>
          <h2>Manage appointments and patient records</h2>
          <p>Review the features available in this frontend demonstration.</p>
        </div>
        <div className="feature-grid">
          {services.map(({ title, desc, icon: Icon }) => (
            <div className="feature card" key={title}>
              <div className="feature-icon">
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section tint">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow">SPECIALISTS</span>
            <h2>Meet our doctors</h2>
            <p>Browse sample specialist profiles and available consultation information.</p>
          </div>
          <div className="doctors-grid">
            {doctors.slice(0, 3).map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
          <div className="center spaced">
            <Link to="/doctors" className="btn btn-outline">
              View all doctors <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="container section">
        <div className="cta card">
          <div>
            <span className="eyebrow">GET STARTED</span>
            <h2>Create your patient account</h2>
            <p>Use a patient account to request and view appointments.</p>
          </div>
          <Link to="/register" className="btn btn-white">
            Create an account <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
