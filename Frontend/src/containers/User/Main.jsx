import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Main() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/university?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/university");
    }
  };

  const categories = [
    { name: "Computer Science & AI", icon: "bi-cpu-fill", count: "1,200+ Courses", color: "#4f46e5", bg: "#eef2ff" },
    { name: "Business & Management", icon: "bi-graph-up-arrow", count: "850+ Courses", color: "#06b6d4", bg: "#ecfeff" },
    { name: "Health & Medicine", icon: "bi-heart-pulse-fill", count: "620+ Courses", color: "#10b981", bg: "#ecfdf5" },
    { name: "Engineering & Tech", icon: "bi-gear-wide-connected", count: "940+ Courses", color: "#f59e0b", bg: "#fffbeb" },
    { name: "Arts & Humanities", icon: "bi-palette-fill", count: "480+ Courses", color: "#8b5cf6", bg: "#f5f3ff" },
    { name: "Law & Policy", icon: "bi-bank2", count: "310+ Courses", color: "#ef4444", bg: "#fef2f2" },
  ];

  const features = [
    {
      icon: "bi-buildings-fill",
      color: "#4f46e5",
      bg: "#eef2ff",
      title: "Global University Directory",
      description: "Explore accredited universities across North America, Europe, Asia, and beyond with verified credentials and rankings."
    },
    {
      icon: "bi-diagram-3-fill",
      color: "#06b6d4",
      bg: "#ecfeff",
      title: "Department Insight & Faculty",
      description: "Dive deep into specific academic faculties, faculty counts, research opportunities, and department contacts."
    },
    {
      icon: "bi-journal-bookmark-fill",
      color: "#10b981",
      bg: "#ecfdf5",
      title: "Comprehensive Course Catalogs",
      description: "Compare course syllabi, duration in weeks, tuition costs, and prerequisite qualifications with ease."
    },
    {
      icon: "bi-shield-check-fill",
      color: "#f59e0b",
      bg: "#fffbeb",
      title: "Verified Student Reviews",
      description: "Read transparent testimonials and ratings from enrolled learners to make confident academic choices."
    }
  ];

  const testimonials = [
    {
      name: "Sophia Chen",
      role: "M.S. Computer Science Student",
      university: "MIT Campus",
      rating: 5,
      avatar: "SC",
      avatarBg: "#4f46e5",
      quote: "CampusConnect streamlined my entire grad school exploration. Comparing department faculties and course durations in one place saved me weeks of manual research!"
    },
    {
      name: "Marcus Aurelius Vance",
      role: "B.A. Economics Candidate",
      university: "Oxford University",
      rating: 5,
      avatar: "MV",
      avatarBg: "#06b6d4",
      quote: "The interactive search and direct contact details allowed me to reach faculty coordinators immediately. The UI is lightning-fast and intuitive."
    },
    {
      name: "Elena Rostova",
      role: "Biomedical Engineering Scholar",
      university: "ETH Zurich",
      rating: 5,
      avatar: "ER",
      avatarBg: "#10b981",
      quote: "Finding high-ranking institutions that fit my exact research criteria was effortless. CampusConnect has set a new gold standard for academic portals."
    }
  ];

  return (
    <div className="landing-page-wrapper">
      {/* Hero Section */}
      <section className="hero-bg-gradient py-5 position-relative overflow-hidden">
        <div className="container py-lg-5 text-center">
          {/* Top Pill */}
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white shadow-sm border border-secondary border-opacity-25 mb-4 animate-fade-in">
            <span className="badge bg-primary rounded-pill px-2 py-1 small">New</span>
            <span className="small fw-semibold text-secondary">
              2026 Global Academic Rankings Live
            </span>
            <i className="bi bi-arrow-right-short text-primary"></i>
          </div>

          {/* Main Title */}
          <h1 className="display-4 fw-extrabold text-dark mb-3 animate-fade-in" style={{ letterSpacing: "-0.03em" }}>
            Discover Your Dream Campus.<br />
            <span className="gradient-text">Shape Your Global Future.</span>
          </h1>

          {/* Subtitle */}
          <p className="lead text-secondary mx-auto mb-4 animate-fade-in" style={{ maxWidth: "720px", fontSize: "1.18rem" }}>
            CampusConnect unites aspiring learners with top-tier universities, departments, and degree programs worldwide. Explore rankings, compare courses, and launch your academic journey.
          </p>

          {/* Hero Search Bar */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-7 col-md-9">
              <form onSubmit={handleHeroSearch} className="glass-card p-2 shadow-lg d-flex gap-2">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-0 text-muted ps-3">
                    <i className="bi bi-search fs-5"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent shadow-none ps-2"
                    placeholder="Search by university name, country, or discipline..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  />
                </div>
                <button type="submit" className="btn-premium-primary px-4 py-2 flex-shrink-0">
                  Search
                </button>
              </form>

              {/* Quick Tags */}
              <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mt-3 small text-secondary">
                <span className="fw-semibold">Trending:</span>
                {["Stanford", "Oxford", "Engineering", "Medicine", "USA", "Canada"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => navigate(`/university?search=${encodeURIComponent(tag)}`)}
                    className="badge bg-white text-secondary border px-2 py-1 text-decoration-none shadow-none hover-lift"
                    style={{ cursor: "pointer" }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <Link to="/university" className="btn-premium-primary px-4 py-3">
              <i className="bi bi-compass"></i> Explore All Universities
            </Link>
            <Link to="/register" className="btn-premium-outline px-4 py-3">
              <i className="bi bi-person-plus"></i> Join Student Community
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-4 bg-white border-top border-bottom border-light">
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="stat-number">500+</div>
                <div className="stat-label">Verified Universities</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="stat-number">2,500+</div>
                <div className="stat-label">Academic Departments</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="stat-number">85+</div>
                <div className="stat-label">Countries Covered</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-box">
                <div className="stat-number">100k+</div>
                <div className="stat-label">Students Guided</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Academic Disciplines */}
      <section className="py-5" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-badge">
              <i className="bi bi-grid-fill"></i> Fields of Study
            </span>
            <h2 className="section-title">Explore by Academic Discipline</h2>
            <p className="section-subtitle">
              Find universities specialized in your target career paths with accredited certifications and degree options.
            </p>
          </div>

          <div className="row g-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div 
                  className="p-4 bg-white rounded-4 border border-light shadow-sm hover-lift d-flex align-items-center gap-3 h-100"
                  onClick={() => navigate(`/university?search=${encodeURIComponent(cat.name.split(' ')[0])}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                    style={{ width: "54px", height: "54px", backgroundColor: cat.bg, color: cat.color, fontSize: "1.5rem" }}
                  >
                    <i className={`bi ${cat.icon}`}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1 fs-6">{cat.name}</h5>
                    <span className="text-muted small fw-medium">{cat.count}</span>
                  </div>
                  <i className="bi bi-arrow-right ms-auto text-muted"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Platform Features */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-badge">
              <i className="bi bi-stars"></i> Platform Superpowers
            </span>
            <h2 className="section-title">Why Students Choose CampusConnect</h2>
            <p className="section-subtitle">
              We eliminate the guesswork in choosing your university by offering comprehensive, real-time verified data.
            </p>
          </div>

          <div className="row g-4">
            {features.map((feat, idx) => (
              <div key={idx} className="col-lg-3 col-md-6">
                <div className="p-4 rounded-4 border border-light bg-white shadow-sm hover-lift h-100 d-flex flex-column">
                  <div 
                    className="feature-icon-box"
                    style={{ backgroundColor: feat.bg, color: feat.color }}
                  >
                    <i className={`bi ${feat.icon}`}></i>
                  </div>
                  <h5 className="fw-bold mb-2">{feat.title}</h5>
                  <p className="text-muted small flex-grow-1" style={{ lineHeight: "1.6" }}>
                    {feat.description}
                  </p>
                  <Link to="/university" className="text-decoration-none fw-semibold small text-primary mt-3 d-inline-flex align-items-center gap-1">
                    Explore Details <i className="bi bi-chevron-right small"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="py-5" style={{ backgroundColor: "#f8fafc" }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="section-badge">
              <i className="bi bi-chat-quote-fill"></i> Community Reviews
            </span>
            <h2 className="section-title">Loved by Students Across the Globe</h2>
            <p className="section-subtitle">
              See how learners leveraged CampusConnect to discover their ideal university and excel.
            </p>
          </div>

          <div className="row g-4">
            {testimonials.map((t, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between hover-lift">
                  <div>
                    {/* Star Rating */}
                    <div className="d-flex gap-1 text-warning mb-3">
                      {[...Array(t.rating)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill small"></i>
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-secondary small fst-italic mb-4" style={{ lineHeight: "1.7" }}>
                      "{t.quote}"
                    </p>
                  </div>
                  {/* User Profile */}
                  <div className="d-flex align-items-center gap-3 pt-3 border-top border-light">
                    <div 
                      className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: "42px", height: "42px", backgroundColor: t.avatarBg, fontSize: "0.9rem" }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark small">{t.name}</h6>
                      <span className="text-muted small">{t.role} • {t.university}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High Conversion CTA Banner */}
      <section className="py-5">
        <div className="container">
          <div 
            className="p-5 rounded-4 shadow-xl text-center text-white position-relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0891b2 100%)",
            }}
          >
            <div className="position-relative z-1 py-3" style={{ maxWidth: "680px", margin: "0 auto" }}>
              <span className="badge bg-white text-dark rounded-pill px-3 py-1 fw-bold mb-3">
                🚀 Join Thousands of Students
              </span>
              <h2 className="display-6 fw-extrabold mb-3 text-white">
                Ready to Find Your Next Academic Home?
              </h2>
              <p className="lead text-light mb-4" style={{ fontSize: "1.05rem", opacity: 0.9 }}>
                Create a free account or start exploring universities instantly. Discover tuition details, courses, and department contacts with one click.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/register" className="btn-premium-accent px-4 py-3">
                  <i className="bi bi-person-check-fill"></i> Get Started Free
                </Link>
                <Link to="/university" className="btn btn-outline-light px-4 py-3 rounded-3 fw-semibold">
                  <i className="bi bi-search"></i> Browse Directory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Main;