import React, { useState } from "react";
import Swal from "sweetalert2";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for contacting CampusConnect. Our academic advisory team will respond within 24 hours.",
        confirmButtonColor: "#4f46e5"
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 600);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: `${label} copied to clipboard.`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="section-badge">
          <i className="bi bi-envelope-fill"></i> Get in Touch
        </span>
        <h1 className="section-title">Contact CampusConnect</h1>
        <p className="section-subtitle">
          Have a question about university listings, department data, or partnerships? Reach out to our global team.
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        {/* Contact Info Sidebar */}
        <div className="col-lg-5 col-md-6">
          <div className="d-flex flex-column gap-3">
            {/* Email Card */}
            <div className="glass-card p-4 hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: "48px", height: "48px", backgroundColor: "#eef2ff", color: "#4f46e5", fontSize: "1.4rem" }}
                >
                  <i className="bi bi-envelope-at-fill"></i>
                </div>
                <div className="flex-grow-1">
                  <span className="text-muted small fw-semibold text-uppercase">Email Support</span>
                  <div className="fw-bold text-dark">support@campusconnect.edu</div>
                </div>
                <button 
                  type="button" 
                  className="btn btn-sm btn-light border text-primary"
                  onClick={() => copyToClipboard("support@campusconnect.edu", "Email")}
                  title="Copy email"
                >
                  <i className="bi bi-copy"></i>
                </button>
              </div>
            </div>

            {/* Phone Card */}
            <div className="glass-card p-4 hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: "48px", height: "48px", backgroundColor: "#ecfeff", color: "#0891b2", fontSize: "1.4rem" }}
                >
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <div className="flex-grow-1">
                  <span className="text-muted small fw-semibold text-uppercase">Direct Phone</span>
                  <div className="fw-bold text-dark">+1 (800) 246-8890</div>
                </div>
                <button 
                  type="button" 
                  className="btn btn-sm btn-light border text-info"
                  onClick={() => copyToClipboard("+1 (800) 246-8890", "Phone")}
                  title="Copy phone"
                >
                  <i className="bi bi-copy"></i>
                </button>
              </div>
            </div>

            {/* Office Card */}
            <div className="glass-card p-4 hover-lift">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: "48px", height: "48px", backgroundColor: "#ecfdf5", color: "#059669", fontSize: "1.4rem" }}
                >
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <div>
                  <span className="text-muted small fw-semibold text-uppercase">Global HQ</span>
                  <div className="fw-bold text-dark">450 University Way, Innovation Park</div>
                  <div className="small text-secondary">Cambridge, MA 02138, USA</div>
                </div>
              </div>
            </div>

            {/* Operational Hours */}
            <div className="p-4 rounded-4 bg-white border border-light shadow-sm">
              <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-clock-history text-warning"></i> Operational Hours
              </h6>
              <p className="text-muted small mb-0">
                Monday – Friday: 8:00 AM – 6:00 PM (EST)<br />
                Saturday – Sunday: Emergency Ticket Queue Only
              </p>
            </div>
          </div>
        </div>

        {/* Contact Message Form */}
        <div className="col-lg-7 col-md-6">
          <div className="glass-card p-4 p-md-5 shadow-lg">
            <h3 className="fw-bold text-dark mb-2">Send Us a Direct Message</h3>
            <p className="text-muted small mb-4">
              Fill in your contact info below and an admissions specialist will reach out promptly.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-dark">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="jane@example.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Inquiry Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. University Accreditation Query"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold text-dark">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="form-control"
                  placeholder="Describe your question, request, or proposal in detail..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-premium-primary w-100 py-2.5 rounded-3 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <i className="bi bi-send-fill"></i> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
