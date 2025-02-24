import axios from 'axios';
import React, { useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

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
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setForm(prevForm => ({
            ...prevForm,
            [e.target.name]: e.target.value
        }));
    };

    function registerUser() {
        axios.post("https://campusconnect-1od1.onrender.com/register", form)
            .then((d) => {
                Swal.fire("Success", d.data.message, "success");
                navigate('/login');
            })
            .catch(error => {
                console.log("Registration Error:", error);
            });
    }

    function onSubmitUser() {
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
            errors.password = "Password must be at least 6 characters long.";
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
        <div className="container mt-5 pt-4"> {/* Prevent navbar overlap */}
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-info text-white text-center">
                            <h4>Register</h4>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">First Name</label>
                                    <input type="text" className="form-control" name="firstname" value={form.firstname} onChange={changeHandler} />
                                    <small className="text-danger">{formError.firstname}</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Middle Name</label>
                                    <input type="text" className="form-control" name="middlename" value={form.middlename} onChange={changeHandler} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Last Name</label>
                                    <input type="text" className="form-control" name="lastname" value={form.lastname} onChange={changeHandler} />
                                    <small className="text-danger">{formError.lastname}</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={form.email} onChange={changeHandler} />
                                    <small className="text-danger">{formError.email}</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" className="form-control" name="password" value={form.password} onChange={changeHandler} />
                                    <small className="text-danger">{formError.password}</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Confirm Password</label>
                                    <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={changeHandler} />
                                    <small className="text-danger">{formError.confirmPassword}</small>
                                </div>

                                <div className="d-grid">
                                    <button type="button" className="btn btn-info " onClick={onSubmitUser}>Register</button>
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-center text-muted">
                            Already have an account? <a href="/login" className="text-primary">Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
