import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function SubmitRequest() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validateForm = () => {
        let newErrors = {};

        if (!form.name.trim()) newErrors.name = "Full name is required";
        if (!form.email.trim()) {
            newErrors.email = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!form.subject.trim()) newErrors.subject = "Request subject is required";
        if (!form.message.trim()) newErrors.message = "Message details cannot be empty";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire({
                icon: "warning",
                title: "Incomplete Fields",
                text: "Please correct highlighted fields before submitting.",
                confirmButtonColor: "#4f46e5"
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("https://campusconnect-1od1.onrender.com/api/requests", form);
            setLoading(false);
            Swal.fire({
                icon: "success",
                title: "Ticket Submitted!",
                text: response.data?.message || "Your request has been filed successfully. A support specialist will follow up shortly.",
                confirmButtonColor: "#4f46e5"
            });
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Submission Issue",
                text: err.response?.data?.message || "Failed to submit request to the server. Please try again or email support directly.",
                confirmButtonColor: "#4f46e5"
            });
        }
    };

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <span className="section-badge">
                    <i className="bi bi-ticket-detailed-fill"></i> Support Desk
                </span>
                <h1 className="section-title">Submit a Support Ticket</h1>
                <p className="section-subtitle">
                    Need technical help, data correction for an institution, or account assistance? File a ticket below.
                </p>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8 col-xl-7">
                    <div className="glass-card p-4 p-md-5 shadow-xl">
                        <form onSubmit={submitHandler}>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold text-dark">
                                        Your Full Name <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-icon-wrapper">
                                        <i className="bi bi-person"></i>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={changeHandler}
                                            className={`form-control ${errors.name ? "is-invalid border-danger" : ""}`}
                                            placeholder="Alexander Hamilton"
                                        />
                                    </div>
                                    {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label small fw-semibold text-dark">
                                        Email Address <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-icon-wrapper">
                                        <i className="bi bi-envelope"></i>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={changeHandler}
                                            className={`form-control ${errors.email ? "is-invalid border-danger" : ""}`}
                                            placeholder="alexander@university.edu"
                                        />
                                    </div>
                                    {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-semibold text-dark">
                                    Request Subject <span className="text-danger">*</span>
                                </label>
                                <div className="input-icon-wrapper">
                                    <i className="bi bi-chat-left-text"></i>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={form.subject}
                                        onChange={changeHandler}
                                        className={`form-control ${errors.subject ? "is-invalid border-danger" : ""}`}
                                        placeholder="e.g. Inquire about scholarship information"
                                    />
                                </div>
                                {errors.subject && <div className="text-danger small mt-1">{errors.subject}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-semibold text-dark">
                                    Detailed Message <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={changeHandler}
                                    className={`form-control ${errors.message ? "is-invalid border-danger" : ""}`}
                                    rows="5"
                                    placeholder="Provide as much context as possible (university name, department, error description, etc.)..."
                                ></textarea>
                                {errors.message && <div className="text-danger small mt-1">{errors.message}</div>}
                            </div>

                            <button
                                type="submit"
                                className="btn-premium-primary w-100 py-2.5 rounded-3 fw-bold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status"></span>
                                        <span>Filing Ticket...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle-fill"></i> Submit Official Ticket
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubmitRequest;
