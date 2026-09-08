import React from "react";
import { Link } from "react-router-dom";

function About() {
  const values = [
    {
      icon: "bi-shield-check",
      title: "Integrity & Verification",
      text: "Every university, department, and course on our network is verified directly against accredited records.",
      color: "#4f46e5",
      bg: "#eef2ff"
    },
    {
      icon: "bi-globe-americas",
      title: "Universal Access",
      text: "We believe transparent academic data should be universally accessible to any aspiring student, anywhere.",
      color: "#06b6d4",
      bg: "#ecfeff"
    },
    {
      icon: "bi-lightning-charge",
      title: "Streamlined Discovery",
      text: "Eliminating months of tedious application navigation through unified catalogs and real-time filtering.",
      color: "#10b981",
      bg: "#ecfdf5"
    },
    {
      icon: "bi-people",
      title: "Student-First Design",
      text: "Built from the ground up prioritizing student clarity, fast responsiveness, and intuitive decision-making.",
      color: "#f59e0b",
      bg: "#fffbeb"
    }
  ];

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="section-badge">
          <i className="bi bi-info-circle-fill"></i> Our Purpose
        </span>
        <h1 className="section-title">About CampusConnect</h1>
        <p className="section-subtitle">
          Empowering the next generation of scholars by bridging the gap between ambitious students and world-class universities.
        </p>
      </div>

      {/* Hero Mission Card */}
      <div 
        className="p-5 rounded-4 shadow-lg text-white mb-5 position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
        }}
      >
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-white text-dark rounded-pill px-3 py-1 fw-bold mb-3">
              🎯 The Mission
            </span>
            <h2 className="display-6 fw-bold text-white mb-3">
              Democratizing Global Higher Education
            </h2>
            <p className="lead text-light mb-0" style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: "1.7" }}>
              CampusConnect was created to eliminate the opacity and fragmentation of university admissions. We provide an integrated, trustworthy directory where learners can explore faculties, course curriculums, contact departments, and plan their future with total clarity.
            </p>
          </div>
          <div className="col-lg-4 text-center mt-4 mt-lg-0">
            <div 
              className="d-inline-flex align-items-center justify-content-center rounded-circle text-white shadow-lg animate-float"
              style={{
                width: "120px",
                height: "120px",
                background: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
                fontSize: "3rem"
              }}
            >
              <i className="bi bi-mortarboard-fill"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="mb-5">
        <div className="text-center mb-4">
          <h3 className="fw-bold text-dark">Our Guiding Values</h3>
          <p className="text-muted small">The foundational pillars behind every platform feature</p>
        </div>

        <div className="row g-4">
          {values.map((v, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div className="glass-card p-4 h-100 hover-lift d-flex flex-column">
                <div 
                  className="feature-icon-box"
                  style={{ backgroundColor: v.bg, color: v.color }}
                >
                  <i className={`bi ${v.icon}`}></i>
                </div>
                <h5 className="fw-bold text-dark mb-2 fs-6">{v.title}</h5>
                <p className="text-muted small mb-0 flex-grow-1" style={{ lineHeight: "1.6" }}>
                  {v.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What We Offer Highlights */}
      <div className="glass-card p-4 p-md-5 mb-5 shadow-sm">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6">
            <span className="section-badge">
              <i className="bi bi-gift-fill"></i> Platform Ecosystem
            </span>
            <h3 className="fw-bold text-dark mb-3">
              Everything You Need in One Unified Academic Hub
            </h3>
            <p className="text-secondary small mb-4" style={{ lineHeight: "1.7" }}>
              From initial university research to reviewing individual course syllabi and inquiring directly with faculties, CampusConnect simplifies your application journey.
            </p>
            <ul className="list-unstyled d-flex flex-column gap-3 small">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check-circle-fill text-success fs-5 flex-shrink-0"></i>
                <span><strong>500+ Verified Universities:</strong> Global institution profiles with official portals, founded dates, and rankings.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check-circle-fill text-success fs-5 flex-shrink-0"></i>
                <span><strong>Detailed Department Breakdowns:</strong> Direct access to department faculties, phones, and academic divisions.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check-circle-fill text-success fs-5 flex-shrink-0"></i>
                <span><strong>Course Duration & Tuition:</strong> Transparent program pricing, durations in weeks, and prerequisites.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check-circle-fill text-success fs-5 flex-shrink-0"></i>
                <span><strong>Instant Support & Guidance:</strong> Fast inquiry channels and responsive student assistance.</span>
              </li>
            </ul>
          </div>
          <div className="col-lg-6">
            <div className="p-4 rounded-4 bg-light border border-secondary border-opacity-10 text-center">
              <h4 className="fw-bold text-dark mb-2">Join CampusConnect Today</h4>
              <p className="text-muted small mb-4">
                Start discovering universities and comparing academic curricula right now.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/university" className="btn-premium-primary">
                  Explore Directory
                </Link>
                <Link to="/register" className="btn-premium-outline">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
