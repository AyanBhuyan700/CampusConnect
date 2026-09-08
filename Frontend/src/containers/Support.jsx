import React from "react";
import { Link } from 'react-router-dom';

const Support = () => {
  const supportChannels = [
    {
      title: "Knowledgebase & FAQs",
      desc: "Instant answers to common questions about admissions, fees, and catalog navigation.",
      icon: "bi-question-circle-fill",
      link: "/faq",
      btnText: "Explore FAQs",
      btnClass: "btn-premium-primary",
      color: "#4f46e5",
      bg: "#eef2ff"
    },
    {
      title: "Submit Support Ticket",
      desc: "Open an official student or institutional support request for complex inquiries.",
      icon: "bi-ticket-detailed-fill",
      link: "/support-request",
      btnText: "Submit Ticket",
      btnClass: "btn-premium-accent",
      color: "#06b6d4",
      bg: "#ecfeff"
    },
    {
      title: "Contact Advisory Team",
      desc: "Speak with our academic team directly via email or our live helpline.",
      icon: "bi-headset",
      link: "/contact",
      btnText: "Contact Us",
      btnClass: "btn-premium-outline",
      color: "#10b981",
      bg: "#ecfdf5"
    }
  ];

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="section-badge">
          <i className="bi bi-life-preserver"></i> Help Desk
        </span>
        <h1 className="section-title">CampusConnect Support Center</h1>
        <p className="section-subtitle">
          Everything you need to navigate our platform smoothly. Select a support option below or browse our knowledgebase.
        </p>
      </div>

      {/* Support Options Cards */}
      <div className="row g-4 justify-content-center mb-5">
        {supportChannels.map((chan, idx) => (
          <div key={idx} className="col-lg-4 col-md-6">
            <div className="glass-card p-4 p-lg-5 text-center h-100 d-flex flex-column align-items-center hover-lift">
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle mb-4"
                style={{ width: "72px", height: "72px", backgroundColor: chan.bg, color: chan.color, fontSize: "2rem" }}
              >
                <i className={`bi ${chan.icon}`}></i>
              </div>
              <h4 className="fw-bold text-dark mb-2">{chan.title}</h4>
              <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: "1.6" }}>
                {chan.desc}
              </p>
              <Link to={chan.link} className={`${chan.btnClass} w-100 py-2 rounded-3`}>
                {chan.btnText} <i className="bi bi-arrow-right-short"></i>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick FAQ Highlights / Escalation banner */}
      <div className="p-4 p-md-5 rounded-4 bg-white border border-light shadow-sm">
        <div className="row align-items-center justify-content-between">
          <div className="col-lg-8">
            <h4 className="fw-bold text-dark mb-2">Need Immediate Academic Assistance?</h4>
            <p className="text-muted small mb-0" style={{ lineHeight: "1.7" }}>
              Our support team handles inquiries Monday through Friday, 8:00 AM – 6:00 PM EST. Most tickets and inquiries receive a response within 4 hours.
            </p>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <Link to="/support-request" className="btn-premium-primary px-4 py-2.5">
              <i className="bi bi-plus-circle"></i> Open Support Ticket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
