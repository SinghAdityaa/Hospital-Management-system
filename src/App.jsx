import React from "react";

import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Register from "./pages/Register";

import BookAppointment from "./pages/BookAppointment";
import CheckEmail from "./pages/CheckEmail";
import VerifyEmail from "./pages/VerifyEmail";

import { About, Services, Contact } from "./pages/StaticPages";

import { PrivacyPolicy, TermsAndConditions } from "./pages/Legal";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  Overview,
  Appointments,
  Profile,
  Patients,
  Reports,
  Prescriptions,
  ManageDoctors,
} from "./pages/Dashboard";

function guard(element, roles) {
  return <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/doctors" element={<Doctors />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route path="/book/:id" element={<BookAppointment />} />

      <Route path="/dashboard" element={guard(<DashboardLayout />)}>
        <Route index element={<Overview />} />
        <Route path="appointments" element={<Appointments />} />
        <Route
          path="profile"
          element={guard(<Profile />, ["patient"])}
        />
        <Route
          path="patients"
          element={guard(<Patients />, ["admin", "reception"])}
        />
        <Route
          path="reports"
          element={guard(<Reports />, ["patient", "lab"])}
        />
        <Route
          path="prescriptions"
          element={guard(<Prescriptions />, ["patient", "doctor", "pharmacy"])}
        />
        <Route
          path="doctors"
          element={guard(<ManageDoctors />, ["admin"])}
        />
      </Route>

      <Route
        path="*"
        element={
          <main className="auth-page">
            <div className="card auth-card center">
              <h1>404</h1>
              <p>Page not found.</p>
              <Link className="btn btn-primary" to="/">
                Back to home
              </Link>
            </div>
          </main>
        }
      />
    </Routes>
  );
}