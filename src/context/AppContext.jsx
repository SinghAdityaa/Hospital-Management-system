
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
  fetchCurrentUser,
} from "../services/authService";

import {
  getToken,
  getStoredUser,
  saveSession,
  clearSession,
} from "../services/tokenStorage";

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

  const [user, setUser] = useState(null);

  // Starts true when a saved token exists, so protected pages
  // wait until the login has been checked after a refresh.
  const [authLoading, setAuthLoading] = useState(() =>
    Boolean(getToken())
  );

  // Persist demo data only
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

  // Restore the login after a page refresh
  useEffect(() => {
    const token = getToken();

    if (!token) {
      setAuthLoading(false);
      return undefined;
    }

    let cancelled = false;

    (async () => {
      try {
        const current = await fetchCurrentUser();
        if (cancelled) return;

        // /me has no first/last name, so keep those from login
        const cached = getStoredUser() || {};
        const merged = normalizeUser({ ...cached, ...current });

        saveSession(token, merged);
        setUser(merged);
      } catch (error) {
        if (cancelled) return;

        const status = error.response?.status;

        if (status === 401 || status === 403) {
          clearSession();
          setUser(null);
        } else {
          // Server asleep or network problem: keep the saved user
          const cached = getStoredUser();
          setUser(cached ? normalizeUser(cached) : null);
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Token expired while using the app
  useEffect(() => {
    const onExpired = () => setUser(null);

    window.addEventListener("auth:expired", onExpired);

    return () =>
      window.removeEventListener("auth:expired", onExpired);
  }, []);

  // Validate login through Spring Boot.
  const login = async (email, password) => {
    setAuthLoading(true);
    setUser(null);
    clearSession();

    try {
      const { token, user: profile } = await loginPatient(
        email,
        password
      );

      const authenticatedUser = normalizeUser(profile);

      saveSession(token, authenticatedUser);
      setUser(authenticatedUser);

      return authenticatedUser;
    } catch (error) {
      setUser(null);
      clearSession();
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

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
          status: "Confirmed",
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
