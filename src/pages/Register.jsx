
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
  ["Emergency Contact", "emergencyContact", "tel", false],
  ["Address", "address", "textarea", false],
  ["City", "city", "text", false],
  ["State", "state", "text", false],
  ["Country", "country", "text", false],
  ["Pincode", "pincode", "text", false],
  ["Password", "password", "password", true],
  ["Confirm Password", "confirmPassword", "password", true],
];

const namePattern = /^[A-Za-z]+$/;
const gmailPattern = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;

const backendFieldMap = {
  dateOfBirth: "dob",
  phoneNumber: "phone",
};

function formatDate(value) {
  if (!value) return "";

  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

function validateField(name, value, values) {
  const text = String(value ?? "").trim();

  switch (name) {
    case "firstName":
    case "lastName": {
      const label =
        name === "firstName" ? "First name" : "Last name";

      if (!text) {
        return `${label} is required.`;
      }

      if (!namePattern.test(text)) {
        return `${label} must contain letters only.`;
      }

      return "";
    }

    case "gender":
      return text ? "" : "Please select your gender.";

    case "dob": {
      if (!text) {
        return "Date of birth is required.";
      }

      const date = new Date(`${text}T00:00:00`);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(date.getTime())) {
        return "Enter a valid date of birth.";
      }

      if (date > today) {
        return "Date of birth cannot be in the future.";
      }

      return "";
    }

    case "email":
      if (!text) {
        return "Email address is required.";
      }

      return gmailPattern.test(text)
        ? ""
        : "Enter a valid Gmail address.";

    case "phone":
      if (!text) {
        return "Phone number is required.";
      }

      return /^\d{10}$/.test(text)
        ? ""
        : "Phone number must contain exactly 10 digits.";

    case "emergencyContact":
      return text && !/^\d{10}$/.test(text)
        ? "Emergency contact must contain exactly 10 digits."
        : "";

    case "pincode":
      return text && !/^\d{6}$/.test(text)
        ? "Pincode must contain exactly 6 digits."
        : "";

    case "password":
      if (!value) {
        return "Password is required.";
      }

      return value.length >= 8
        ? ""
        : "Password must contain at least 8 characters.";

    case "confirmPassword":
      if (!value) {
        return "Please confirm your password.";
      }

      return value === values.password
        ? ""
        : "Passwords do not match.";

    default:
      return "";
  }
}

function validateForm(values) {
  const errors = {};

  fields.forEach(([, name]) => {
    const message = validateField(
      name,
      values[name],
      values
    );

    if (message) {
      errors[name] = message;
    }
  });

  return errors;
}

function getBackendErrors(error) {
  const response = error.response?.data;
  const fieldErrors = {};

  const items = Array.isArray(response?.errors)
    ? response.errors
    : Array.isArray(response)
      ? response
      : [];

  items.forEach((item) => {
    if (!item?.field || !item?.message) {
      return;
    }

    const fieldName =
      backendFieldMap[item.field] || item.field;

    if (fields.some(([, name]) => name === fieldName)) {
      fieldErrors[fieldName] = item.message;
    }
  });

  return fieldErrors;
}

function getBackendErrorCode(error) {
  return String(
    error.response?.data?.code || ""
  ).toUpperCase();
}

function getGeneralError(error) {
  const status = error.response?.status;
  const data = error.response?.data;
  const errorCode = getBackendErrorCode(error);

  if (errorCode === "EMAIL_ALREADY_EXISTS") {
    return "This email is already registered. Please log in.";
  }

  if (status === 409 && errorCode === "EMAIL_NOT_VERIFIED") {
    return "Your account is already registered but your email is not verified.";
  }

  if (status === 400) {
    return (
      data?.message ||
      "Some registration details are invalid. Please check your information."
    );
  }

  if (status === 403) {
    return "Registration was rejected by the server. Please contact support.";
  }

  if (status === 429) {
    return "Too many attempts. Please wait before trying again.";
  }

  if (status >= 500) {
    return "The server could not complete registration. Please try again later.";
  }

  if (error.code === "ECONNABORTED") {
    return "The server did not respond in time. Your account may have been created. Please check your email before trying again.";
  }

  if (!error.response) {
    return "Unable to reach the registration server. Please check your connection.";
  }

  return (
    data?.message ||
    "Registration failed. Please try again later."
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [duplicateEmail, setDuplicateEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedValues = {
      ...values,
      [name]: value,
    };

    setValues(updatedValues);
    setGeneralError("");
    setDuplicateEmail(false);

    setErrors((previous) => {
      const next = { ...previous };

      if (touched[name] || previous[name]) {
        const message = validateField(
          name,
          value,
          updatedValues
        );

        if (message) {
          next[name] = message;
        } else {
          delete next[name];
        }
      }

      if (
        name === "password" &&
        (touched.confirmPassword || previous.confirmPassword)
      ) {
        const message = validateField(
          "confirmPassword",
          updatedValues.confirmPassword,
          updatedValues
        );

        if (message) {
          next.confirmPassword = message;
        } else {
          delete next.confirmPassword;
        }
      }

      return next;
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }));

    const message = validateField(
      name,
      value,
      values
    );

    setErrors((previous) => {
      const next = { ...previous };

      if (message) {
        next[name] = message;
      } else {
        delete next[name];
      }

      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setGeneralError("");
    setDuplicateEmail(false);

    const validationErrors = validateForm(values);

    setErrors(validationErrors);

    setTouched(
      Object.fromEntries(
        fields.map(([, name]) => [name, true])
      )
    );

    if (Object.keys(validationErrors).length > 0) {
      setGeneralError(
        "Please correct the highlighted fields before continuing."
      );

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
        values.emergencyContact?.trim() || null,
      address: values.address?.trim() || null,
      city: values.city?.trim() || null,
      state: values.state?.trim() || null,
      country: values.country?.trim() || null,
      pincode: values.pincode?.trim() || null,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    setLoading(true);

    try {
      await registerPatient(patientData);

      // New patient registration was successful.
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
    } catch (error) {
      const status = error.response?.status;
      const errorCode = getBackendErrorCode(error);

      // Existing patient whose email is not verified.
      // Open the Check Email page automatically.
      if (
        status === 409 &&
        errorCode === "EMAIL_NOT_VERIFIED"
      ) {
        navigate("/check-email", {
          replace: true,
          state: {
            email: patientData.email,
          },
        });

        return;
      }

      // Existing registered and verified patient.
      if (
        status === 409 &&
        errorCode === "EMAIL_ALREADY_EXISTS"
      ) {
        setDuplicateEmail(true);
        setErrors({});

        setGeneralError(
          "This email is already registered. Please log in."
        );

        return;
      }

      // Handle any other backend validation errors.
      const backendErrors = getBackendErrors(error);

      setDuplicateEmail(false);
      setErrors(backendErrors);

      if (Object.keys(backendErrors).length > 0) {
        setGeneralError(
          "Please correct the highlighted fields."
        );
      } else {
        setGeneralError(getGeneralError(error));
      }

      // Log only non-sensitive error information.
      if (import.meta.env.DEV) {
        console.warn("Registration request failed:", {
          status: status ?? null,
          code: errorCode || null,
          message:
            error.response?.data?.message ||
            error.message,
        });
      }
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
          noValidate
        >
          {fields.map(
            ([label, name, type, required, options]) => {
              const fieldError = errors[name];
              const errorId = `${name}-error`;

              const isWide = [
                "bloodGroup",
                "email",
                "address",
              ].includes(name);

              const commonProps = {
                name,
                value: values[name] || "",
                onChange: handleChange,
                onBlur: handleBlur,
                disabled: loading,
                required: Boolean(required),
                "aria-invalid": Boolean(fieldError),
                "aria-describedby": fieldError
                  ? errorId
                  : undefined,
              };

              return (
                <label
                  key={name}
                  className={isWide ? "wide" : ""}
                >
                  {label}

                  {required && <span>*</span>}

                  {type === "select" ? (
                    <select {...commonProps}>
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
                      {...commonProps}
                      rows={3}
                      placeholder={label}
                    />
                  ) : (
                    <input
                      {...commonProps}
                      type={type}
                      placeholder={label}
                      autoComplete={
                        type === "password"
                          ? "new-password"
                          : undefined
                      }
                    />
                  )}

                  {fieldError && (
                    <small
                      id={errorId}
                      className="field-error"
                      role="alert"
                    >
                      {fieldError}
                    </small>
                  )}
                </label>
              );
            }
          )}

          {generalError && (
            <div
              className="error wide"
              role="alert"
            >
              <p>{generalError}</p>

              {duplicateEmail && (
                <div className="register-error-actions">
                  <Link to="/login">
                    Go to Login
                  </Link>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary wide full"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="signup-line">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
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
