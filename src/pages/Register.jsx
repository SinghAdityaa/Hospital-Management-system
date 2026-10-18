
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerPatient } from "../services/patientService";
import { EMAIL_VERIFICATION_ENABLED } from "../services/emailVerificationService";

const fields = [
  ["First Name", "firstName", "text", true],
  ["Last Name", "lastName", "text", true],
  [
    "Gender",
    "gender",
    "select",
    true,
    ["Male", "Female", "Other", "Prefer not to say"],
  ],
  ["Date of Birth", "dob", "date", true],
  [
    "Blood Group",
    "bloodGroup",
    "select",
    false,
    ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  ],
  ["Email", "email", "email", true],
  ["Phone", "phone", "tel", true],
  ["Emergency Contact", "emergencyContact", "tel"],
  ["Address", "address", "textarea"],
  ["City", "city", "text"],
  ["State", "state", "text"],
  ["Country", "country", "text"],
  ["Pincode", "pincode", "text"],
  ["Password", "password", "password", true],
  ["Confirm Password", "confirmPassword", "password", true],
];

function formatDate(date) {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${day}-${month}-${year}`;
}

function getErrorMessage(error) {
  const status = error.response?.status;
  const responseData = error.response?.data;

  if (status === 409) {
    return "This email is already registered. Please log in instead.";
  }

  if (status === 429) {
    return "Too many registration attempts. Please try again later.";
  }

  if (status === 400) {
    if (
      typeof responseData?.message === "string"
    ) {
      return responseData.message;
    }

    return "Please check your registration details.";
  }

  if (error.code === "ECONNABORTED") {
    return "The server is taking too long to respond. Please try again later.";
  }

  if (!error.response) {
    return "Unable to connect to the server. Please check your connection.";
  }

  return "Registration failed. Please try again later.";
}

export default function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if ((values.password || "").length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!/^\d{10}$/.test(values.phone || "")) {
      setError(
        "Phone number must contain exactly 10 digits."
      );
      return;
    }

    if (
      values.emergencyContact &&
      !/^\d{10}$/.test(values.emergencyContact)
    ) {
      setError(
        "Emergency contact must contain exactly 10 digits."
      );
      return;
    }

    if (
      values.pincode &&
      !/^\d{6}$/.test(values.pincode)
    ) {
      setError("Pincode must contain exactly 6 digits.");
      return;
    }

    if (
      !/^[A-Za-z0-9._%+-]+@gmail\.com$/i.test(
        values.email || ""
      )
    ) {
      setError("Please enter a valid Gmail address.");
      return;
    }

    const patientData = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      gender: values.gender,
      dateOfBirth: formatDate(values.dob),
      bloodGroup: values.bloodGroup || null,
      email: values.email.trim().toLowerCase(),
      phoneNumber: values.phone.trim(),
      emergencyContact:
        values.emergencyContact || null,
      address: values.address || null,
      city: values.city || null,
      state: values.state || null,
      country: values.country || null,
      pincode: values.pincode || null,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    setLoading(true);

    try {
      await registerPatient(patientData);

      if (EMAIL_VERIFICATION_ENABLED) {
        navigate("/check-email", {
          replace: true,
          state: {
            email: patientData.email,
          },
        });
      } else {
        navigate("/login", {
          replace: true,
          state: {
            registrationSuccess: true,
          },
        });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-screen">
      <div className="register-card card">
        <header className="register-title">
          <h2>Patient Registration</h2>

          <p>
            Create your account to book appointments.
          </p>
        </header>

        <form
          className="register-grid form"
          onSubmit={handleSubmit}
        >
          {fields.map(
            ([label, name, type, required, options]) => (
              <label
                key={name}
                className={
                  ["bloodGroup", "email", "address"].includes(
                    name
                  )
                    ? "wide"
                    : ""
                }
              >
                {label}
                {required && <span>*</span>}

                {type === "select" ? (
                  <select
                    name={name}
                    required={Boolean(required)}
                    value={values[name] || ""}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">
                      Select {label}
                    </option>

                    {options.map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                ) : type === "textarea" ? (
                  <textarea
                    name={name}
                    rows={3}
                    placeholder={label}
                    value={values[name] || ""}
                    onChange={handleChange}
                    disabled={loading}
                  />
                ) : (
                  <input
                    name={name}
                    required={Boolean(required)}
                    type={type}
                    placeholder={label}
                    value={values[name] || ""}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete={
                      name === "password" ||
                      name === "confirmPassword"
                        ? "new-password"
                        : undefined
                    }
                  />
                )}
              </label>
            )
          )}

          {error && (
            <div
              className="error wide"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary wide full"
            disabled={loading}
          >
            {loading
              ? "Registering..."
              : "Register"}
          </button>
        </form>

        <p className="signup-line">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

        <p className="center">
          <Link to="/" className="muted">
            Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
