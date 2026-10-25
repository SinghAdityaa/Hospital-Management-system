import React, { useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import DoctorCard from '../components/Doctors/DoctorCard';
import { useApp } from '../context/AppContext';
import { Search } from 'lucide-react';

const PAGE_SIZE = 3; // keep it a multiple of 3 (6, 9, 12) for the 3-column grid

const SORTS = {
  default: { label: 'Recommended', fn: null },
  'fee-asc': { label: 'Fees: Low to High', fn: (a, b) => Number(a.fee) - Number(b.fee) },
  'fee-desc': { label: 'Fees: High to Low', fn: (a, b) => Number(b.fee) - Number(a.fee) },
  'exp-desc': {
    label: 'Experience: Most first',
    fn: (a, b) => Number(b.experience) - Number(a.experience),
  },
  'name-asc': { label: 'Name: A to Z', fn: (a, b) => a.name.localeCompare(b.name) },
};

function getPageList(current, total) {
  const wanted = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) result.push('…');
    result.push(p);
  });
  return result;
}

export default function Doctors() {
  const { doctors } = useApp();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const topRef = useRef(null);

  const specialties = ['All', ...new Set(doctors.map((d) => d.specialization))];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = doctors.filter(
      (d) =>
        (d.name + ' ' + d.specialization).toLowerCase().includes(term) &&
        (specialty === 'All' || d.specialization === specialty),
    );
    const sorter = SORTS[sort]?.fn;
    return sorter ? [...list].sort(sorter) : list;
  }, [doctors, search, specialty, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  function goToPage(p) {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <Navbar />
      <main className="section container">
        <div className="section-title">
          <span className="eyebrow">FIND A SPECIALIST</span>
          <h1>Our Doctors</h1>
          <p>Choose the right doctor for your care.</p>
        </div>

        <div className="filters card" ref={topRef}>
          <label className="search-input">
            <Search size={19} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search doctors or specialties..."
            />
          </label>
          <select
            aria-label="Filter by specialization"
            value={specialty}
            onChange={(e) => {
              setSpecialty(e.target.value);
              setPage(1);
            }}
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All specializations' : s}
              </option>
            ))}
          </select>
          <select
            aria-label="Sort doctors"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>

        {filtered.length > 0 && (
          <p className="muted results-count">
            Showing {startIndex + 1}–{startIndex + visible.length} of {filtered.length} doctors
          </p>
        )}

        <div className="doctors-grid">
          {visible.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>

        {!filtered.length && <div className="empty card">No doctors match your search.</div>}

        {totalPages > 1 && (
          <nav className="pagination" aria-label="Doctors pages">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              Previous
            </button>

            {getPageList(currentPage, totalPages).map((p, i) =>
              p === '…' ? (
                <span key={'gap' + i} className="page-gap">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={p === currentPage ? 'active' : ''}
                  aria-current={p === currentPage ? 'page' : undefined}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}