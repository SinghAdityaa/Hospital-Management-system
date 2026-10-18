
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  load,
  save,
  reset,
  makeId,
} from "../services/storage";

import {
  loginPatient,
  logoutPatient,
} from "../services/authService";

const AppContext = createContext(null);

function normalizeUser(profile) {
  if (!profile || typeof profile !== "object") {
    throw new Error(
      "Invalid user information received from the server."
    );
  }

  const fullName = String(
    profile.name || profile.fullName || ""
  ).trim();

  const nameParts = fullName
    ? fullName.split(/\s+/)
    : [];

  const firstName =
    profile.firstName ||
    nameParts[0] ||
    "Patient";

  const lastName =
    profile.lastName ||
    nameParts.slice(1).join(" ");

  const role = String(profile.role || "PATIENT")
    .replace(/^ROLE_/i, "")
    .toLowerCase();

  return {
    ...profile,
    id: profile.id,
    email: profile.email,
    firstName,
    lastName,
    role,
  };
}

export function AppProvider({ children }) {
  // Existing demo data for features that
  // are not yet connected to Spring Boot.
  const [data, setData] = useState(() => ({
    ...load(),
    session: null,
  }));

  // Login exists only while this React
  // application instance is running.
  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] =
    useState(false);

  // Persist demo data only, never a
  // logged-in user or login credentials.
  useEffect(() => {
    save({
      ...data,
      session: null,
    });
  }, [data]);

  const update = (callback) => {
    setData((previous) => ({
      ...previous,
      ...callback(previous),
      session: null,
    }));
  };

  // Validate login through Spring Boot.
  const login = async (email, password) => {
    setAuthLoading(true);
    setUser(null);

    try {
      const profile = await loginPatient(
        email,
        password
      );

      const authenticatedUser =
        normalizeUser(profile);

      setUser(authenticatedUser);

      return authenticatedUser;
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Clear the current user from React memory.
  const logout = () => {
    logoutPatient();
    setUser(null);
  };

  // Registration is performed by patientService.js.
  const register = async () => {
    throw new Error(
      "Patient registration must use the Spring Boot registration API."
    );
  };

  // Appointments: existing demo operations.
  const addAppointment = (appointment) => {
    update((previous) => ({
      appointments: [
        {
          ...appointment,
          id: makeId("a"),
          createdAt: new Date()
            .toISOString()
            .slice(0, 10),
          status: "Pending",
        },
        ...previous.appointments,
      ],
    }));
  };

  const changeAppointment = (id, status) => {
    update((previous) => ({
      appointments: previous.appointments.map(
        (item) =>
          item.id === id
            ? { ...item, status }
            : item
      ),
    }));
  };

  // Laboratory: existing demo operations.
  const addReport = (report) => {
    update((previous) => ({
      reports: [
        {
          ...report,
          id: makeId("r"),
          date: new Date()
            .toISOString()
            .slice(0, 10),
        },
        ...previous.reports,
      ],
    }));
  };

  const changeReport = (id, status) => {
    update((previous) => ({
      reports: previous.reports.map(
        (item) =>
          item.id === id
            ? { ...item, status }
            : item
      ),
    }));
  };

  // Prescriptions: existing demo operations.
  const addPrescription = (prescription) => {
    update((previous) => ({
      prescriptions: [
        {
          ...prescription,
          id: makeId("p"),
          date: new Date()
            .toISOString()
            .slice(0, 10),
          status: "Pending",
        },
        ...previous.prescriptions,
      ],
    }));
  };

  const changePrescription = (id, status) => {
    update((previous) => ({
      prescriptions: previous.prescriptions.map(
        (item) =>
          item.id === id
            ? { ...item, status }
            : item
      ),
    }));
  };

  // Doctors: existing demo operations.
  const addDoctor = (doctor) => {
    update((previous) => ({
      doctors: [
        ...previous.doctors,
        {
          ...doctor,
          id: makeId("d"),
        },
      ],
    }));
  };

  const removeDoctor = (id) => {
    update((previous) => ({
      doctors: previous.doctors.filter(
        (doctor) => doctor.id !== id
      ),
    }));
  };

  const resetDemo = () => {
    setData({
      ...reset(),
      session: null,
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...data,
        session: null,
        user,
        authLoading,
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
        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used within AppProvider"
    );
  }

  return context;
}
