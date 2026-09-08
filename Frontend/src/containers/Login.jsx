import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [formError, setFormError] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
        if (formError[e.target.name]) {
            setFormError((prev) => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const loginCheck = async () => {
        setLoading(true);
        try {
            const response = await axios.post("https://campusconnect-1od1.onrender.com/login", form);
            localStorage.setItem("id", response.data.id);
            localStorage.setItem("role", response.data.role);

            Swal.fire({
                icon: "success",
                title: "Welcome Back!",
                text: "Login successful. Redirecting...",
                timer: 1500,
                showConfirmButton: false
            });

            setTimeout(() => {
                if (response.data.role === "admin") {
                    navigate("/universityAdmin");
                } else {
                    navigate("/");
                }
                window.location.reload();
            }, 1000);
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Authentication Failed",
                text: error.response?.data?.message || "Invalid email or password. Please try again.",
                confirmButtonColor: "#4f46e5"
            });
            setForm((prev) => ({ ...prev, password: "" }));
        }
    };

    const onLoginSubmit = (e) => {
        e.preventDefault();
        let errors = {};
        let hasErrors = false;

        if (!form.email.trim()) {
            hasErrors = true;
            errors.email = "Please enter your email address";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            hasErrors = true;
            errors.email = "Please enter a valid email format";
        }

        if (!form.password.trim()) {
            hasErrors = true;
            errors.password = "Please enter your password";
        }

        setFormError(errors);

        if (!hasErrors) {
            loginCheck();
        }
    };

    return (
        <div className="auth-bg-gradient py-5 d-flex align-items-center justify-content-center" style={{ minHeight: "85vh" }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5 col-xl-4">
                        {/* Logo & Portal Header */}
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
                                Welcome Back
                            </h2>
                            <p className="text-muted small">
                                Sign in to your CampusConnect academic portal
                            </p>
                        </div>

                        {/* Login Card */}
                        <div className="glass-card p-4 p-sm-5 shadow-xl">
                            <form onSubmit={onLoginSubmit}>
                                {/* Email Field */}
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-dark">
                                        Email Address
                                    </label>
                                    <div className="input-icon-wrapper">
                                        <i className="bi bi-envelope"></i>
                                        <input
                                            type="email"
                                            name="email"
                                            className={`form-control ${formError.email ? 'is-invalid border-danger' : ''}`}
                                            placeholder="student@university.edu"
                                            onChange={changeHandler}
                                            value={form.email}
                                        />
                                    </div>
                                    {formError.email && (
                                        <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                                            <i className="bi bi-exclamation-circle-fill"></i> {formError.email}
                                        </div>
                                    )}
                                </div>

                                {/* Password Field with Show/Hide Toggle */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <label className="form-label small fw-semibold text-dark mb-0">
                                            Password
                                        </label>
                                        <Link to="/support" className="text-decoration-none small text-primary fw-medium">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="input-icon-wrapper position-relative">
                                        <i className="bi bi-shield-lock"></i>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className={`form-control ${formError.password ? 'is-invalid border-danger' : ''}`}
                                            placeholder="Enter password"
                                            onChange={changeHandler}
                                            value={form.password}
                                            style={{ paddingRight: "2.75rem" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm position-absolute end-0 top-50 translate-middle-y border-0 text-muted me-2 shadow-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                        </button>
                                    </div>
                                    {formError.password && (
                                        <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                                            <i className="bi bi-exclamation-circle-fill"></i> {formError.password}
                                        </div>
                                    )}
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
                                            <span>Signing In...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In to Account</span>
                                            <i className="bi bi-arrow-right-short fs-5"></i>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Sign Up Link */}
                            <div className="text-center pt-3 border-top border-light small text-secondary">
                                New to CampusConnect?{" "}
                                <Link to="/register" className="text-primary fw-bold text-decoration-none">
                                    Create Student Account
                                </Link>
                            </div>
                        </div>

                        {/* Security reassurance */}
                        <div className="text-center mt-4 text-muted small d-flex align-items-center justify-content-center gap-2">
                            <i className="bi bi-shield-check text-success"></i>
                            <span>Protected by 256-bit encrypted authentication</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
