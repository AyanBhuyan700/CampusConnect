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

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.subject.trim()) newErrors.subject = "Subject is required";
        if (!form.message.trim()) newErrors.message = "Message cannot be empty";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire("Validation Error", "Please fill all fields correctly", "warning");
            return;
        }

        try {
            const response = await axios.post("https://campusconnect-1od1.onrender.com/api/requests", form);
            Swal.fire("Success", response.data.message, "success");
            setForm({ name: "", email: "", subject: "", message: "" }); 
        } catch (err) {
            Swal.fire("Error", "Failed to submit request", "error");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center text-primary">Submit a Request</h2>
                <form onSubmit={submitHandler}>
                    {/* Name */}
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" name="name" value={form.name} onChange={changeHandler}
                            className={`form-control ${errors.name && "is-invalid"}`} placeholder="Your Name" />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email" value={form.email} onChange={changeHandler}
                            className={`form-control ${errors.email && "is-invalid"}`} placeholder="Your Email" />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    {/* Subject */}
                    <div className="mb-3">
                        <label className="form-label">Subject</label>
                        <input type="text" name="subject" value={form.subject} onChange={changeHandler}
                            className={`form-control ${errors.subject && "is-invalid"}`} placeholder="Request Subject" />
                        {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                    </div>

                    {/* Message */}
                    <div className="mb-3">
                        <label className="form-label">Message</label>
                        <textarea name="message" value={form.message} onChange={changeHandler}
                            className={`form-control ${errors.message && "is-invalid"}`} rows="4" placeholder="Enter your message"></textarea>
                        {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary fw-bold">
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SubmitRequest;
