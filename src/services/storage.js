const KEY = 'healthcare_plus_demo_v1';
const users = [
  {
    id: 'u1',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'patient@demo.com',
    password: 'Demo@123',
    role: 'patient',
    phone: '9876543210',
    bloodGroup: 'O+',
  },
  {
    id: 'u2',
    firstName: 'Arjun',
    lastName: 'Mehta',
    email: 'doctor@demo.com',
    password: 'Demo@123',
    role: 'doctor',
    specialization: 'Cardiology',
  },
  {
    id: 'u3',
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@demo.com',
    password: 'Demo@123',
    role: 'admin',
  },
  {
    id: 'u4',
    firstName: 'Riya',
    lastName: 'Desk',
    email: 'reception@demo.com',
    password: 'Demo@123',
    role: 'reception',
  },
  {
    id: 'u5',
    firstName: 'Lab',
    lastName: 'Technician',
    email: 'lab@demo.com',
    password: 'Demo@123',
    role: 'lab',
  },
  {
    id: 'u6',
    firstName: 'Pharmacy',
    lastName: 'Staff',
    email: 'pharmacy@demo.com',
    password: 'Demo@123',
    role: 'pharmacy',
  },
];
const doctors = [
  {
    id: 'd1',
    name: 'Dr. Arjun Mehta',
    specialization: 'Cardiology',
    experience: 12,
    fee: 800,
    days: 'Mon to Sat',
    time: '10:00 AM to 4:00 PM',
    bio: 'Heart health and preventive cardiology',
    userId: 'u2',
  },
  {
    id: 'd2',
    name: 'Dr. Sneha Iyer',
    specialization: 'Dermatology',
    experience: 9,
    fee: 650,
    days: 'Mon to Fri',
    time: '11:00 AM to 6:00 PM',
    bio: 'Skin, hair and cosmetic dermatology',
  },
  {
    id: 'd3',
    name: 'Dr. Rahul Verma',
    specialization: 'Orthopedics',
    experience: 15,
    fee: 900,
    days: 'Tue to Sun',
    time: '9:00 AM to 2:00 PM',
    bio: 'Bones, joints and sports injuries',
  },
  {
    id: 'd4',
    name: 'Dr. Kavya Nair',
    specialization: 'Pediatrics',
    experience: 8,
    fee: 600,
    days: 'Mon to Sat',
    time: '10:00 AM to 5:00 PM',
    bio: 'Compassionate care for children',
  },
  {
    id: 'd5',
    name: 'Dr. Aditi Rao',
    specialization: 'Neurology',
    experience: 11,
    fee: 1000,
    days: 'Mon to Fri',
    time: '12:00 PM to 6:00 PM',
    bio: 'Neurological consultations and care',
  },
  {
    id: 'd6',
    name: 'Dr. Vikram Shah',
    specialization: 'General Medicine',
    experience: 10,
    fee: 500,
    days: 'Every day',
    time: '9:00 AM to 7:00 PM',
    bio: 'Primary care and wellness check-ups',
  },
];
const appointments = [
  {
    id: 'a1',
    patientId: 'u1',
    patientName: 'Priya Sharma',
    doctorId: 'd1',
    doctorName: 'Dr. Arjun Mehta',
    specialization: 'Cardiology',
    date: '2026-11-02',
    time: '10:30',
    reason: 'Routine heart check-up',
    status: 'Confirmed',
    createdAt: '2026-10-10',
  },
];
const reports = [
  {
    id: 'r1',
    patientId: 'u1',
    patientName: 'Priya Sharma',
    test: 'Complete Blood Count',
    date: '2026-10-08',
    status: 'Completed',
    result: 'Values within normal limits',
    notes: 'Demo result only',
  },
];
const prescriptions = [
  {
    id: 'p1',
    patientId: 'u1',
    patientName: 'Priya Sharma',
    doctorName: 'Dr. Arjun Mehta',
    medicine: 'Vitamin D3',
    dosage: 'As directed by doctor',
    status: 'Pending',
    date: '2026-10-08',
  },
];
const seed = { users, doctors, appointments, reports, prescriptions, session: null };
export function load() {
  try {
    const obj = JSON.parse(localStorage.getItem(KEY));
    if (obj && Array.isArray(obj.users)) return obj;
  } catch {}
  return structuredClone(seed);
}
export function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
export function reset() {
  localStorage.removeItem(KEY);
  return load();
}
export function makeId(prefix) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}
