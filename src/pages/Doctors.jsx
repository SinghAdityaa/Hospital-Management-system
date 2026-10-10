import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import DoctorCard from '../components/Doctors/DoctorCard';
import { useApp } from '../context/AppContext';
import { Search } from 'lucide-react';
export default function Doctors() {
  const { doctors } = useApp();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const specialties = ['All', ...new Set(doctors.map((d) => d.specialization))];
  const list = doctors.filter(
    (d) =>
      (d.name + ' ' + d.specialization).toLowerCase().includes(search.toLowerCase()) &&
      (specialty === 'All' || d.specialization === specialty),
  );
  return (
    <>
      <Navbar />
      <main className="section container">
        <div className="section-title">
          <span className="eyebrow">FIND A SPECIALIST</span>
          <h1>Our Doctors</h1>
          <p>Choose the right doctor for your care.</p>
        </div>
        <div className="filters card">
          <label className="search-input">
            <Search size={19} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctors or specialties..."
            />
          </label>
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
            {specialties.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="doctors-grid">
          {list.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
        {!list.length && <div className="empty card">No doctors match your search.</div>}
      </main>
      <Footer />
    </>
  );
}
