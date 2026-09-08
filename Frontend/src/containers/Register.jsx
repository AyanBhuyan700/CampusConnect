import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Register() {
    const [form, setForm] = useState({
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [formError, setFormError] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setForm(prevForm => ({
            ...prevForm,
            [e.target.name]: e.target.value
        }));
        if (formError[e.target.name]) {
            setFormError(prev => ({ ...prev, [e.target.name]: "" }));
        }
    };

    function registerUser() {
        setLoading(true);
        axios.post("https://campusconnect-1od1.onrender.com/register", form)
            .then((d) => {
                setLoading(false);
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful!",
                    text: d.data.message || "Your student account has been created. Please sign in.",
                    confirmButtonColor: "#4f46e5"
                }).then(() => {
                    navigate('/login');
                });
            })
            .catch(error => {
                setLoading(false);
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: error.response?.data?.message || "Something went wrong during registration. Please try again.",
                    confirmButtonColor: "#4f46e5"
                });
            });
    }

    function onSubmitUser(e) {
        e.preventDefault();
        let errors = {};
        let isValid = true;

        if (!form.firstname.trim()) {
            isValid = false;
            errors.firstname = "First name is required.";
        }

        if (!form.lastname.trim()) {
            isValid = false;
            errors.lastname = "Last name is required.";
        }

        if (!form.email.trim()) {
            isValid = false;
            errors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            isValid = false;
            errors.email = "Invalid email format.";
        }

        if (!form.password.trim()) {
            isValid = false;
            errors.password = "Password is required.";
        } else if (form.password.length < 6) {
            isValid = false;
            errors.password = "Must be at least 6 characters.";
        }

        if (form.confirmPassword !== form.password) {
            isValid = false;
            errors.confirmPassword = "Passwords do not match.";
        }

        setFormError(errors);

        if (isValid) {
            registerUser();
        }
    }

    return (
        <div className="auth-bg-gradient py-5 d-flex align-items-center justify-content-center" style={{ minHeight: "85vh" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-7 col-xl-6">
                        {/* Header */}
                        <div className="text-center mb-4">
                            <div 
                                className="d-inline-flex align-items-center justify-content-center rounded-4 shadow-sm mb-3"
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                                    color: "#fff"
                                }}
                            >
                                <i className="bi bi-mortarboard-fill fs-3"></i>
                            </div>
                            <h2 className="fw-extrabold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
                                Create Your Account
                            </h2>
                            <p className="text-muted small">
                                Join the global academic network to track applications and access course catalogs
                            </p>
                        </div>

                        {/* Registration Card */}
                        <div className="glass-card p-4 p-sm-5 shadow-xl">
                            <form onSubmit={onSubmitUser}>
                                {/* Name Fields (Grid) */}
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold text-dark">
                                            First Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${formError.firstname ? 'is-invalid border-danger' : ''}`}
                                            name="firstname"
                                            placeholder="John"
                                            value={form.firstname}
                                            onChange={changeHandler}
                                        />
                                        {formError.firstname && (
                                            <div className="text-danger small mt-1">{formError.firstname}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold text-dark">
                                            Last Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${formError.lastname ? 'is-invalid border-danger' : ''}`}
                                            name="lastname"
                                            placeholder="Doe"
                                            value={form.lastname}
                                            onChange={changeHandler}
                                        />
                                        {formError.lastname && (
                                            <div className="text-danger small mt-1">{formError.lastname}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Middle Name */}
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-dark">
                                        Middle Name <span className="text-muted small fw-normal">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="middlename"
                                        placeholder="Alexander"
                                        value={form.middlename}
                                        onChange={changeHandler}
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-dark">
                                        Email Address <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-icon-wrapper">
                                        <i className="bi bi-envelope"></i>
                                        <input
                                            type="email"
                                            className={`form-control ${formError.email ? 'is-invalid border-danger' : ''}`}
                                            name="email"
                                            placeholder="student@example.com"
                                            value={form.email}
                                            onChange={changeHandler}
                                        />
                                    </div>
                                    {formError.email && (
                                        <div className="text-danger small mt-1">{formError.email}</div>
                                    )}
                                </div>

                                {/* Password Fields (Grid) */}
                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold text-dark">
                                            Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-icon-wrapper position-relative">
                                            <i className="bi bi-lock"></i>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control ${formError.password ? 'is-invalid border-danger' : ''}`}
                                                name="password"
                                                placeholder="Min 6 characters"
                                                value={form.password}
                                                onChange={changeHandler}
                                                style={{ paddingRight: "2.5rem" }}
                                            />
                                        </div>
                                        {formError.password && (
                                            <div className="text-danger small mt-1">{formError.password}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label small fw-semibold text-dark">
                                            Confirm Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-icon-wrapper position-relative">
                                            <i className="bi bi-check2-circle"></i>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control ${formError.confirmPassword ? 'is-invalid border-danger' : ''}`}
                                                name="confirmPassword"
                                                placeholder="Repeat password"
                                                value={form.confirmPassword}
                                                onChange={changeHandler}
                                                style={{ paddingRight: "2.5rem" }}
                                            />
                                        </div>
                                        {formError.confirmPassword && (
                                            <div className="text-danger small mt-1">{formError.confirmPassword}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Toggle Password Visibility */}
                                <div className="form-check mb-4">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="showPasswordCheck"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                    <label className="form-check-label small text-muted" htmlFor="showPasswordCheck">
                                        Show passwords in plain text
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn-premium-primary w-100 py-2.5 rounded-3 mb-3 fw-bold"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Complete Registration</span>
                                            <i className="bi bi-arrow-right-short fs-5"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Back to Login */}
                            <div className="text-center pt-3 border-top border-light small text-secondary">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary fw-bold text-decoration-none">
                                    Sign In Here
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
