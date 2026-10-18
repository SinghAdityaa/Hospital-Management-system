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
    [
      "Male",
      "Female",
      "Other",
      "Prefer not to say",
    ],
  ],

  ["Date of Birth", "dob", "date", true],

  [
    "Blood Group",
    "bloodGroup",
    "select",
    false,
    [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ],
  ],

  ["Email", "email", "email", true],
  ["Phone", "phone", "tel", true],

  [
    "Emergency Contact",
    "emergencyContact",
    "tel",
  ],

  ["Address", "address", "textarea"],
  ["City", "city", "text"],
  ["State", "state", "text"],
  ["Country", "country", "text"],
  ["Pincode", "pincode", "text"],

  [
    "Password",
    "password",
    "password",
    true,
  ],

  [
    "Confirm Password",
    "confirmPassword",
    "password",
    true,
  ],
];

const namePattern = /^[A-Za-z]+$/;

const backendFieldMap = {
  dateOfBirth: "dob",
  phoneNumber: "phone",
};

function formatDate(date) {
  if (!date) return "";

  const [year, month, day] =
    date.split("-");

  return `${day}-${month}-${year}`;
}

function validateField(name, value, values) {
  const text = String(
    value ?? ""
  ).trim();

  switch (name) {
    case "firstName":
    case "lastName": {
      const label =
        name === "firstName"
          ? "First name"
          : "Last name";

      if (!text) {
        return `${label} is required.`;
      }

      if (!namePattern.test(text)) {
        return `${label} must contain letters only (no spaces, numbers or symbols).`;
      }

      return "";
    }

    case "gender":
      return text
        ? ""
        : "Please select your gender.";

    case "dob": {
      if (!text) {
        return "Date of birth is required.";
      }

      const selectedDate = new Date(
        `${text}T00:00:00`
      );

      if (
        Number.isNaN(
          selectedDate.getTime()
        )
      ) {
        return "Please enter a valid date of birth.";
      }

      const today = new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      if (selectedDate > today) {
        return "Date of birth cannot be in the future.";
      }

      return "";
    }

    case "email": {
      if (!text) {
        return "Email address is required.";
      }

      if (
        !/^[A-Za-z0-9._%+-]+@gmail\.com$/i.test(
          text
        )
      ) {
        return "Please enter a valid Gmail address.";
      }

      return "";
    }

    case "phone": {
      if (!text) {
        return "Phone number is required.";
      }

      if (!/^\d{10}$/.test(text)) {
        return "Phone number must contain exactly 10 digits.";
      }

      return "";
    }

    case "emergencyContact":
      if (
        text &&
        !/^\d{10}$/.test(text)
      ) {
        return "Emergency contact must contain exactly 10 digits.";
      }

      return "";

    case "pincode":
      if (
        text &&
        !/^\d{6}$/.test(text)
      ) {
        return "Pincode must contain exactly 6 digits.";
      }

      return "";

    case "password":
      if (!value) {
        return "Password is required.";
      }

      if (value.length < 8) {
        return "Password must contain at least 8 characters.";
      }

      return "";

    case "confirmPassword":
      if (!value) {
        return "Please confirm your password.";
      }

      if (value !== values.password) {
        return "Passwords do not match.";
      }

      return "";

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

  if (
    Array.isArray(response?.errors)
  ) {
    response.errors.forEach((item) => {
      if (
        !item?.field ||
        !item?.message
      ) {
        return;
      }

      const fieldName =
        backendFieldMap[item.field] ||
        item.field;

      fieldErrors[fieldName] =
        item.message;
    });
  }

  return fieldErrors;
}

function getGeneralError(error) {
  const status =
    error.response?.status;

  if (status === 409) {
    return "This email is already registered. Please log in instead.";
  }

  if (status === 429) {
    return "Too many registration attempts. Please try again later.";
  }

  if (status === 400) {
    return (
      error.response?.data?.message ||
      "Please check your registration details."
    );
  }

  if (
    error.code === "ECONNABORTED"
  ) {
    return "The server is taking too long to respond. Please try again later.";
  }

  if (!error.response) {
    return "Unable to connect to the server. Please check your connection.";
  }

  return "Registration failed. Please try again later.";
}

export default function Register() {
  const navigate = useNavigate();

  const [values, setValues] =
    useState({});

  const [errors, setErrors] =
    useState({});

  const [touched, setTouched] =
    useState({});

  const [
    generalError,
    setGeneralError,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    const updatedValues = {
      ...values,
      [name]: value,
    };

    setValues(updatedValues);
    setGeneralError("");

    setErrors((previous) => {
      const updatedErrors = {
        ...previous,
      };

      if (
        touched[name] ||
        previous[name]
      ) {
        const message = validateField(
          name,
          value,
          updatedValues
        );

        if (message) {
          updatedErrors[name] =
            message;
        } else {
          delete updatedErrors[name];
        }
      }

      if (
        name === "password" &&
        touched.confirmPassword
      ) {
        const confirmMessage =
          validateField(
            "confirmPassword",
            updatedValues.confirmPassword,
            updatedValues
          );

        if (confirmMessage) {
          updatedErrors.confirmPassword =
            confirmMessage;
        } else {
          delete updatedErrors.confirmPassword;
        }
      }

      return updatedErrors;
    });
  };

  const handleBlur = (event) => {
    const { name, value } =
      event.target;

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
      const updatedErrors = {
        ...previous,
      };

      if (message) {
        updatedErrors[name] =
          message;
      } else {
        delete updatedErrors[name];
      }

      return updatedErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setGeneralError("");

    const validationErrors =
      validateForm(values);

    setErrors(validationErrors);

    const allTouched =
      Object.fromEntries(
        fields.map(([, name]) => [
          name,
          true,
        ])
      );

    setTouched(allTouched);

    if (
      Object.keys(validationErrors)
        .length > 0
    ) {
      setGeneralError(
        "Please correct the highlighted fields before continuing."
      );

      return;
    }

    const patientData = {
      firstName:
        values.firstName.trim(),

      lastName:
        values.lastName.trim(),

      gender: values.gender,

      dateOfBirth: formatDate(
        values.dob
      ),

      bloodGroup:
        values.bloodGroup || null,

      email: values.email
        .trim()
        .toLowerCase(),

      phoneNumber:
        values.phone.trim(),

      emergencyContact:
        values.emergencyContact?.trim() ||
        null,

      address:
        values.address?.trim() ||
        null,

      city:
        values.city?.trim() ||
        null,

      state:
        values.state?.trim() ||
        null,

      country:
        values.country?.trim() ||
        null,

      pincode:
        values.pincode?.trim() ||
        null,

      password: values.password,

      confirmPassword:
        values.confirmPassword,
    };

    setLoading(true);

    try {
      await registerPatient(
        patientData
      );

      if (
        EMAIL_VERIFICATION_ENABLED
      ) {
        navigate(
          "/check-email",
          {
            replace: true,
            state: {
              email:
                patientData.email,
            },
          }
        );
      } else {
        navigate(
          "/login",
          {
            replace: true,
            state: {
              registrationSuccess: true,
            },
          }
        );
      }
    } catch (error) {
      const backendErrors =
        getBackendErrors(error);

      if (
        Object.keys(backendErrors)
          .length > 0
      ) {
        setErrors(
          backendErrors
        );

        setGeneralError(
          "Please correct the highlighted fields."
        );
      } else {
        setGeneralError(
          getGeneralError(error)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-screen">
      <div className="register-card card">
        <header className="register-title">
          <h2>
            Patient Registration
          </h2>

          <p>
            Create your account to
            book appointments.
          </p>
        </header>

        <form
          className="register-grid form"
          onSubmit={handleSubmit}
          noValidate
        >
          {fields.map(
            ([
              label,
              name,
              type,
              required,
              options,
            ]) => {
              const fieldError =
                errors[name];

              const errorId =
                `${name}-error`;

              return (
                <label
                  key={name}
                  className={
                    [
                      "bloodGroup",
                      "email",
                      "address",
                    ].includes(name)
                      ? "wide"
                      : ""
                  }
                >
                  {label}

                  {required && (
                    <span>*</span>
                  )}

                  {type === "select" ? (
                    <select
                      name={name}
                      required={Boolean(
                        required
                      )}
                      value={
                        values[name] || ""
                      }
                      onChange={
                        handleChange
                      }
                      onBlur={
                        handleBlur
                      }
                      disabled={loading}
                      aria-invalid={Boolean(
                        fieldError
                      )}
                      aria-describedby={
                        fieldError
                          ? errorId
                          : undefined
                      }
                    >
                      <option value="">
                        Select {label}
                      </option>

                      {options.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  ) : type ===
                    "textarea" ? (
                    <textarea
                      name={name}
                      rows={3}
                      placeholder={label}
                      value={
                        values[name] || ""
                      }
                      onChange={
                        handleChange
                      }
                      onBlur={
                        handleBlur
                      }
                      disabled={loading}
                      aria-invalid={Boolean(
                        fieldError
                      )}
                      aria-describedby={
                        fieldError
                          ? errorId
                          : undefined
                      }
                    />
                  ) : (
                    <input
                      name={name}
                      required={Boolean(
                        required
                      )}
                      type={type}
                      placeholder={label}
                      value={
                        values[name] || ""
                      }
                      onChange={
                        handleChange
                      }
                      onBlur={
                        handleBlur
                      }
                      disabled={loading}
                      aria-invalid={Boolean(
                        fieldError
                      )}
                      aria-describedby={
                        fieldError
                          ? errorId
                          : undefined
                      }
                      autoComplete={
                        name ===
                          "password" ||
                        name ===
                          "confirmPassword"
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
              {generalError}
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
          <Link to="/login">
            Login
          </Link>
        </p>

        <p className="center">
          <Link
            to="/"
            className="muted"
          >
            Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}