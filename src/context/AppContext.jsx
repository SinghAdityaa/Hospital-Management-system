import React, { createContext, useContext, useState, useEffect } from 'react';
import { load, save, reset, makeId } from '../services/storage';
const Context = createContext(null);
export function AppProvider({ children }) {
  const [data, setData] = useState(load);
  useEffect(() => save(data), [data]);
  const update = (fn) => setData((prev) => ({ ...prev, ...fn(prev) }));
  const login = (email, password) => {
    const user = data.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
    );
    if (!user) throw Error('Invalid email or password');
    update(() => ({ session: user.id }));
    return user;
  };
  const logout = () => update(() => ({ session: null }));
  const register = (payload) => {
    if (data.users.some((u) => u.email.toLowerCase() === payload.email.trim().toLowerCase()))
      throw Error('Email already registered');
    const user = { ...payload, id: makeId('u'), role: 'patient' };
    update((prev) => ({ users: [...prev.users, user], session: user.id }));
    return user;
  };
  const addAppointment = (obj) =>
    update((prev) => ({
      appointments: [
        {
          ...obj,
          id: makeId('a'),
          createdAt: new Date().toISOString().slice(0, 10),
          status: 'Pending',
        },
        ...prev.appointments,
      ],
    }));
  const changeAppointment = (id, status) =>
    update((prev) => ({
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    }));
  const addReport = (obj) =>
    update((prev) => ({
      reports: [
        { ...obj, id: makeId('r'), date: new Date().toISOString().slice(0, 10) },
        ...prev.reports,
      ],
    }));
  const changeReport = (id, status) =>
    update((prev) => ({ reports: prev.reports.map((r) => (r.id === id ? { ...r, status } : r)) }));
  const addPrescription = (obj) =>
    update((prev) => ({
      prescriptions: [
        { ...obj, id: makeId('p'), date: new Date().toISOString().slice(0, 10), status: 'Pending' },
        ...prev.prescriptions,
      ],
    }));
  const changePrescription = (id, status) =>
    update((prev) => ({
      prescriptions: prev.prescriptions.map((p) => (p.id === id ? { ...p, status } : p)),
    }));
  const addDoctor = (obj) =>
    update((prev) => ({ doctors: [...prev.doctors, { ...obj, id: makeId('d') }] }));
  const removeDoctor = (id) =>
    update((prev) => ({ doctors: prev.doctors.filter((d) => d.id !== id) }));
  const user = data.users.find((u) => u.id === data.session) || null;
  return (
    <Context.Provider
      value={{
        ...data,
        user,
        login,
        logout,
        register,
        addAppointment,
        changeAppointment,
        addReport,
        changeReport,
        addPrescription,
        changePrescription,
        addDoctor,
        removeDoctor,
        resetDemo: () => setData(reset()),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useApp = () => useContext(Context);
