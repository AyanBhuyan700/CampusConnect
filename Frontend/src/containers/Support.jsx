import React from "react";

const Support = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center py-5">
      <h1 className="text-info text-center fw-bold mb-3">Support Center</h1>
      <p className="text-center text-muted mb-4" style={{ maxWidth: "600px" }}>
        Need help? Our support team is here to assist you. Check our FAQs, contact us, or submit a support request below.
      </p>

      {/* Support Options */}
      <div className="row g-4 w-100 justify-content-center" style={{ maxWidth: "900px" }}>
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <i className="bi bi-question-circle text-info display-4"></i>
            <h5 className="fw-semibold mt-3">FAQs</h5>
            <p className="text-muted">Find answers to questions.</p>
            <a href="/faq" className="btn btn-info">View FAQs</a>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <i className="bi bi-envelope text-info display-4"></i>
            <h5 className="fw-semibold mt-3">Contact Support</h5>
            <p className="text-muted">Reach out to our support team.</p>
            <a href="/contact" className="btn btn-info">Contact Us</a>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3">
            <i className="bi bi-tools text-info display-4"></i>
            <h5 className="fw-semibold mt-3">Submit a Request</h5>
            <p className="text-muted">Open a support ticket.</p>
            <a href="/support-request" className="btn btn-info">Submit Request</a>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-5 text-center">
        <h2 className="text-info fw-semibold">Need More Help?</h2>
        <p className="text-muted">📧 Email: support@CampusConnect.com</p>
        <p className="text-muted">📞 Phone: +123 456 7890</p>
        <p className="text-muted">📍 Office: 123 University Street, City, Country</p>
      </div>
    </div>
  );
};

export default Support;
