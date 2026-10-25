import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  Stethoscope,
  FlaskConical,
  Pill,
  CheckCircle2,
  Clock3,
  ClipboardList,
  PlusCircle,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
const title = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
const Status = ({ value }) => (
  <span className={'status status-' + (value || 'pending').toLowerCase().replace(/\s/g, '-')}>
    {value}
  </span>
);
const Empty = ({ text }) => <div className="empty">{text || 'No records found.'}</div>;
const Table = ({ headers, rows }) => (
  <div className="table-scroll">
    <table>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  </div>
);
const Stat = ({ icon: Icon, label, value }) => (
  <div className="stat-card card">
    <div className="stat-icon">
      <Icon size={23} />
    </div>
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  </div>
);
function appointmentsFor(user, appointments, doctors) {
  if (user.role === 'patient') return appointments.filter((a) => a.patientId === user.id);
  if (user.role === 'doctor') {
    const own = doctors.filter((d) => d.userId === user.id).map((d) => d.id);
    return appointments.filter((a) => own.includes(a.doctorId));
  }
  return appointments;
}
function Intro({ title: heading, desc }) {
  return (
    <div className="dash-intro">
      <h1>{heading}</h1>
      <p>{desc}</p>
    </div>
  );
}
export function Overview() {
  const { user, appointments, doctors, users, reports, prescriptions } = useApp();
  const ap = appointmentsFor(user, appointments, doctors);
  const role = user.role;
  const roleLabel = role === 'reception' ? 'Reception' : title(role);
  return (
    <>
      <Intro
        title={`Welcome back, ${user.firstName}! 👋`}
        desc={`Here's what's happening in your ${roleLabel.toLowerCase()} portal.`}
      />
      <div className="stats-grid">
        {(role === 'patient'
          ? [
              [CalendarDays, 'My appointments', ap.length],
              [Clock3, 'Awaiting confirmation', ap.filter((a) => a.status === 'Pending').length],
              [FlaskConical, 'Lab reports', reports.filter((r) => r.patientId === user.id).length],
              [Pill, 'Prescriptions', prescriptions.filter((p) => p.patientId === user.id).length],
            ]
          : role === 'doctor'
            ? [
                [CalendarDays, 'My appointments', ap.length],
                [Clock3, 'Pending', ap.filter((a) => a.status === 'Pending').length],
                [CheckCircle2, 'Treated', ap.filter((a) => a.status === 'Completed').length],
                [Users, 'Patients', new Set(ap.map((a) => a.patientId)).size],
              ]
            : role === 'lab'
              ? [
                  [FlaskConical, 'Reports', reports.length],
                  [Clock3, 'Pending reports', reports.filter((r) => r.status === 'Pending').length],
                  [
                    CheckCircle2,
                    'Completed',
                    reports.filter((r) => r.status === 'Completed').length,
                  ],
                ]
              : role === 'pharmacy'
                ? [
                    [Pill, 'Prescriptions', prescriptions.length],
                    [
                      Clock3,
                      'To dispense',
                      prescriptions.filter((p) => p.status === 'Pending').length,
                    ],
                    [
                      CheckCircle2,
                      'Dispensed',
                      prescriptions.filter((p) => p.status === 'Dispensed').length,
                    ],
                  ]
                : [
                    [CalendarDays, 'Appointments', appointments.length],
                    [Users, 'Patients', users.filter((u) => u.role === 'patient').length],
                    [Stethoscope, 'Doctors', doctors.length],
                    [Clock3, 'Pending', appointments.filter((a) => a.status === 'Pending').length],
                  ]
        ).map(([Icon, label, value]) => (
          <Stat key={label} icon={Icon} label={label} value={value} />
        ))}
      </div>
      <div className="dashboard-panels">
        <div className="card pad">
          <div className="panel-title">
            <h2>Recent appointments</h2>
            <Link to="/dashboard/appointments">View all →</Link>
          </div>
          {ap.length ? (
            <Table
              headers={['Patient', 'Doctor', 'Date', 'Status']}
              rows={ap.slice(0, 5).map((a) => (
                <tr key={a.id}>
                  <td>{a.patientName}</td>
                  <td>{a.doctorName}</td>
                  <td>{a.date}</td>
                  <td>
                    <Status value={a.status} />
                  </td>
                </tr>
              ))}
            />
          ) : (
            <Empty text="No appointments yet" />
          )}
        </div>
        <div className="card pad">
          <h2>Quick actions</h2>
          <div className="quick-actions">
            {role === 'patient' ? (
              <>
                <Link to="/doctors" className="quick-link">
                  <Stethoscope /> Find a doctor
                </Link>
                <Link to="/dashboard/reports" className="quick-link">
                  <FlaskConical /> View reports
                </Link>
                <Link to="/dashboard/profile" className="quick-link">
                  <Users /> My profile
                </Link>
              </>
            ) : role === 'admin' ? (
              <>
                <Link to="/dashboard/doctors" className="quick-link">
                  <PlusCircle /> Manage doctors
                </Link>
                <Link to="/dashboard/patients" className="quick-link">
                  <Users /> View patients
                </Link>
              </>
            ) : role === 'lab' ? (
              <Link to="/dashboard/reports" className="quick-link">
                <FlaskConical /> Manage lab reports
              </Link>
            ) : role === 'pharmacy' ? (
              <Link to="/dashboard/prescriptions" className="quick-link">
                <Pill /> Manage prescriptions
              </Link>
            ) : (
              <>
                <Link to="/dashboard/appointments" className="quick-link">
                  <ClipboardList /> Manage appointments
                </Link>
                <Link to="/dashboard/prescriptions" className="quick-link">
                  <Pill /> Manage prescriptions
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export function Appointments() {
  const { user, appointments, doctors, changeAppointment } = useApp();
  const list = appointmentsFor(user, appointments, doctors);
  const loc = useLocation();
  return (
    <>
      <Intro
        title={user.role === 'patient' ? 'My Appointments' : 'Manage Appointments'}
        desc="View appointment details and current status."
      />
      {loc.state?.success && <div className="success banner">{loc.state.success}</div>}
      <div className="card pad">
        {list.length ? (
          <Table
            headers={[
              'Patient',
              'Doctor',
              'Date / Time',
              'Reason',
              'Status',
              ...(user.role === 'patient' ? [] : ['Actions']),
            ]}
            rows={list.map((a) => (
              <tr key={a.id}>
                <td>{a.patientName}</td>
                <td>
                  {a.doctorName}
                  <small>{a.specialization}</small>
                </td>
                <td>
                  {a.date}
<small>{a.time}{a.endTime ? ' - ' + a.endTime : ''}</small>                </td>
                <td>{a.reason}</td>
                <td>
                  <Status value={a.status} />
                </td>
                {user.role !== 'patient' ? (
                  <td>
                    <select
                      aria-label="Update appointment status"
                      value={a.status}
                      onChange={(e) => changeAppointment(a.id, e.target.value)}
                    >
                      {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                ) : null}
              </tr>
            ))}
          />
        ) : (
          <Empty text="No appointments to display." />
        )}
        {user.role === 'patient' && (
          <div className="spaced">
            <Link className="btn btn-primary" to="/doctors">
              Book an appointment
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
export function Profile() {
  const { user } = useApp();
  return (
    <>
      <Intro title="My Profile" desc="Your registered patient information" />
      <div className="card pad profile-card">
        <div className="profile-avatar">{user.firstName?.[0]}</div>
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <span className="specialty">{title(user.role)}</span>
        <div className="profile-grid">
          {[
            ['Email', user.email],
            ['Phone', user.phone],
            ['Gender', user.gender],
            ['Date of birth', user.dob],
            ['Blood group', user.bloodGroup],
            ['Emergency contact', user.emergencyContact],
            ['Address', user.address],
            ['City', user.city],
            ['State', user.state],
            ['Country', user.country],
            ['Pincode', user.pincode],
          ].map(([label, value]) => (
            <div key={label}>
              <small>{label}</small>
              <strong>{value || 'Not provided'}</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
export function Patients() {
  const { users } = useApp();
  const list = users.filter((u) => u.role === 'patient');
  return (
    <>
      <Intro title="Patients" desc="Registered patients in the demo system" />
      <div className="card pad">
        {list.length ? (
          <Table
            headers={['Name', 'Email', 'Phone', 'Blood group', 'City']}
            rows={list.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>{u.phone || ': '}</td>
                <td>{u.bloodGroup || ': '}</td>
                <td>{u.city || ': '}</td>
              </tr>
            ))}
          />
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
export function Reports() {
  const { user, reports, users, addReport, changeReport } = useApp();
  const [open, setOpen] = useState(false),
    [form, setForm] = useState({
      patientId: '',
      test: '',
      result: '',
      notes: '',
      status: 'Pending',
    });
  const patients = users.filter((u) => u.role === 'patient');
  const list = user.role === 'patient' ? reports.filter((r) => r.patientId === user.id) : reports;
  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  function submit(e) {
    e.preventDefault();
    const patient = patients.find((p) => p.id === form.patientId);
    if (!patient) return;
    addReport({ ...form, patientName: patient.firstName + ' ' + patient.lastName });
    setOpen(false);
    setForm({ patientId: '', test: '', result: '', notes: '', status: 'Pending' });
  }
  return (
    <>
      <Intro
        title="Lab Reports"
        desc={
          user.role === 'lab'
            ? 'Record test results and update laboratory work'
            : 'Your diagnostic reports and test status'
        }
      />
      {user.role === 'lab' && (
        <button className="btn btn-primary section-action" onClick={() => setOpen(!open)}>
          <PlusCircle size={18} /> {open ? 'Close form' : 'Add Report'}
        </button>
      )}
      {open && (
        <form className="card pad form inline-create" onSubmit={submit}>
          <h2>New lab report</h2>
          <label>
            Patient
            <select required name="patientId" onChange={onChange} value={form.patientId}>
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Test name
            <input required name="test" value={form.test} onChange={onChange} />
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={onChange}>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </label>
          <label>
            Result
            <textarea name="result" value={form.result} onChange={onChange} />
          </label>
          <label>
            Notes
            <textarea name="notes" value={form.notes} onChange={onChange} />
          </label>
          <button className="btn btn-primary">Save report</button>
        </form>
      )}
      <div className="card pad">
        {list.length ? (
          <Table
            headers={[
              'Patient',
              'Test',
              'Date',
              'Result',
              'Status',
              ...(user.role === 'lab' ? ['Update'] : []),
            ]}
            rows={list.map((r) => (
              <tr key={r.id}>
                <td>{r.patientName}</td>
                <td>{r.test}</td>
                <td>{r.date}</td>
                <td>
                  {r.result || 'Awaiting result'}
                  <small>{r.notes}</small>
                </td>
                <td>
                  <Status value={r.status} />
                </td>
                {user.role === 'lab' && (
                  <td>
                    <select value={r.status} onChange={(e) => changeReport(r.id, e.target.value)}>
                      <option>Pending</option>
                      <option>Completed</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          />
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
export function Prescriptions() {
  const { user, prescriptions, users, addPrescription, changePrescription } = useApp();
  const [open, setOpen] = useState(false),
    [form, setForm] = useState({ patientId: '', medicine: '', dosage: '' });
  const patients = users.filter((u) => u.role === 'patient');
  const list =
    user.role === 'patient'
      ? prescriptions.filter((p) => p.patientId === user.id)
      : user.role === 'doctor'
        ? prescriptions.filter(
            (p) =>
              p.doctorName === user.firstName + ' ' + user.lastName ||
              p.doctorName === 'Dr. ' + user.firstName + ' ' + user.lastName,
          )
        : prescriptions;
  function submit(e) {
    e.preventDefault();
    const patient = patients.find((p) => p.id === form.patientId);
    if (!patient) return;
    addPrescription({
      ...form,
      patientName: patient.firstName + ' ' + patient.lastName,
      doctorName: 'Dr. ' + user.firstName + ' ' + user.lastName,
    });
    setOpen(false);
    setForm({ patientId: '', medicine: '', dosage: '' });
  }
  return (
    <>
      <Intro
        title="Prescriptions"
        desc={
          user.role === 'pharmacy'
            ? 'Manage dispensing status'
            : user.role === 'doctor'
              ? 'Issue patient prescriptions'
              : 'View prescription records'
        }
      />
      {user.role === 'doctor' && (
        <button className="btn btn-primary section-action" onClick={() => setOpen(!open)}>
          <PlusCircle size={18} /> {open ? 'Close form' : 'New prescription'}
        </button>
      )}
      {open && (
        <form className="card pad form inline-create" onSubmit={submit}>
          <h2>Issue prescription</h2>
          <label>
            Patient
            <select
              required
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
            >
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Medicine
            <input
              required
              value={form.medicine}
              onChange={(e) => setForm({ ...form, medicine: e.target.value })}
            />
          </label>
          <label>
            Dosage / notes
            <textarea
              required
              value={form.dosage}
              onChange={(e) => setForm({ ...form, dosage: e.target.value })}
            />
          </label>
          <button className="btn btn-primary">Save prescription</button>
        </form>
      )}
      <div className="card pad">
        {list.length ? (
          <Table
            headers={[
              'Patient',
              'Doctor',
              'Medicine',
              'Dosage',
              'Date',
              'Status',
              ...(user.role === 'pharmacy' ? ['Action'] : []),
            ]}
            rows={list.map((p) => (
              <tr key={p.id}>
                <td>{p.patientName}</td>
                <td>{p.doctorName}</td>
                <td>{p.medicine}</td>
                <td>{p.dosage}</td>
                <td>{p.date}</td>
                <td>
                  <Status value={p.status} />
                </td>
                {user.role === 'pharmacy' && (
                  <td>
                    <select
                      value={p.status}
                      onChange={(e) => changePrescription(p.id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Dispensed</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          />
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
export function ManageDoctors() {
  const { doctors, addDoctor, removeDoctor } = useApp();
  const [open, setOpen] = useState(false),
    [form, setForm] = useState({
      name: '',
      specialization: '',
      experience: 1,
      fee: 500,
      time: '10:00 AM to 5:00 PM',
      days: 'Mon to Sat',
      bio: '',
    });
  function submit(e) {
    e.preventDefault();
    addDoctor(form);
    setOpen(false);
    setForm({
      name: '',
      specialization: '',
      experience: 1,
      fee: 500,
      time: '10:00 AM to 5:00 PM',
      days: 'Mon to Sat',
      bio: '',
    });
  }
  return (
    <>
      <Intro title="Manage Doctors" desc="Add or remove doctors from the directory" />
      <button className="btn btn-primary section-action" onClick={() => setOpen(!open)}>
        <PlusCircle size={18} /> {open ? 'Close form' : 'Add doctor'}
      </button>
      {open && (
        <form className="card pad inline-create form" onSubmit={submit}>
          {[
            ['Doctor name', 'name'],
            ['Specialization', 'specialization'],
            ['Experience (years)', 'experience'],
            ['Consultation fee (₹)', 'fee'],
            ['Working hours', 'time'],
            ['Working days', 'days'],
            ['Bio', 'bio'],
          ].map(([label, key]) => (
            <label key={key}>
              {label}
              <input
                required={key !== 'bio'}
                type={['experience', 'fee'].includes(key) ? 'number' : 'text'}
                min={0}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </label>
          ))}
          <button className="btn btn-primary">Add doctor</button>
        </form>
      )}
      <div className="card pad">
        <Table
          headers={['Name', 'Specialty', 'Experience', 'Fee', 'Actions']}
          rows={doctors.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.specialization}</td>
              <td>{d.experience} years</td>
              <td>₹{d.fee}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    if (window.confirm('Remove this doctor from the directory?'))
                      removeDoctor(d.id);
                  }}
                >
                  <Trash2 size={15} /> Remove
                </button>
              </td>
            </tr>
          ))}
        />
      </div>
    </>
  );
}
