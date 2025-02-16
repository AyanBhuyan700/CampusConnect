import { useState } from "react";
import React from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent Successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center py-5">
      <h1 className="text-info text-center fw-bold mb-3">Contact Us</h1>
      <p className="text-center text-muted mb-4" style={{ maxWidth: "600px" }}>
        Have questions or need assistance? Fill out the form below, and we'll get back to you as soon as possible.
      </p>

      <div className="card p-4 shadow-lg" style={{ width: "100%", maxWidth: "600px" }}>
        <form onSubmit={handleSubmit} className="w-100">
          {/* Name & Email in One Line */}
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-center w-100">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control text-center"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-center w-100">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control text-center"
                required
              />
            </div>
          </div>

          {/* Full Width Message Field */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-center w-100">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="form-control text-center"
              required
            ></textarea>
          </div>

          {/* Centered Button */}
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-info px-4">
              Send Message
            </button>
          </div>
        </form>
      </div>

      {/* Contact Details */}
      <div className="mt-4 text-center">
        <h2 className="text-info fw-semibold">Other Ways to Reach Us</h2>
        <p className="text-muted mt-2">📍 Address: 123 University Street, City, Country</p>
        <p className="text-muted">📧 Email: support@CampusConnect.com</p>
        <p className="text-muted">📞 Phone: +123 456 7890</p>
      </div>
    </div>
  );
};

export default Contact;
