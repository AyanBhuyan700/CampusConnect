import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [formError, setFormError] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    // Handle input change
    const changeHandler = (e) => {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    };

    // Function to handle login
    const loginCheck = async () => {
        try {
            const response = await axios.post("https://campusconnect-1od1.onrender.com/login", form);
            localStorage.setItem("id", response.data.id);
            localStorage.setItem("role", response.data.role);

            if (response.data.role === "admin") {
                navigate("/universityAdmin");
            } else {
                navigate("/");
            }
      window.location.reload();
        } catch (error) {
            Swal.fire("Error", "Wrong username or password", "error")
            setForm({ email: "", password: "" });
        }
    };

    // Function to validate form and submit
    const onLoginSubmit = () => {
        let errors = {};
        let hasErrors = false;

        if (!form.email.trim()) {
            hasErrors = true;
            errors.email = "Email is required";
        }

        if (!form.password.trim()) {
            hasErrors = true;
            errors.password = "Password is required";
        }

        setFormError(errors);

        if (!hasErrors) {
            loginCheck();
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg w-50">
                <div className="card-header bg-info text-white text-center">
                    <h4>Login</h4>
                </div>
                <div className="card-body">
                    {/* Email Field */}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            onChange={changeHandler}
                            value={form.email}
                        />
                        <p className="text-danger">{formError.email}</p>
                    </div>

                    {/* Password Field */}
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter your password"
                            onChange={changeHandler}
                            value={form.password}
                        />
                        <p className="text-danger">{formError.password}</p>
                    </div>
                </div>
                <div className="card-footer text-center">
                    <button className="btn btn-info fw-bold w-100" onClick={onLoginSubmit}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
