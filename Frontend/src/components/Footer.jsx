import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Footer = () => {
    const year = new Date().getFullYear();
    const [newsletterEmail, setNewsletterEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            Swal.fire({
                icon: 'warning',
                title: 'Please enter a valid email address',
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Subscribed!',
            text: 'Thank you for subscribing to CampusConnect academic updates.',
            timer: 2500,
            showConfirmButton: false,
        });
        setNewsletterEmail('');
    };

    return (
        <footer className="mt-auto" style={{ backgroundColor: '#0b1329', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="container py-5">
                <div className="row g-4 justify-content-between">
                    {/* Brand & Mission */}
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <div 
                                className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                                    color: "#fff"
                                }}
                            >
                                <i className="bi bi-mortarboard-fill fs-5"></i>
                            </div>
                            <span className="fw-bold fs-4 text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Campus<span style={{ color: "#06b6d4" }}>Connect</span>
                            </span>
                        </div>
                        <p className="small text-secondary mb-4" style={{ lineHeight: "1.7", maxWidth: "340px" }}>
                            The premier global platform connecting students, educators, and leading universities worldwide. Find your ideal campus and accelerate your academic journey.
                        </p>
                        <div className="d-flex align-items-center gap-2">
                            <div className="pulse-dot"></div>
                            <span className="text-light small fw-medium">All Academic Services Operational</span>
                        </div>
                    </div>

                    {/* Quick Navigation Links */}
                    <div className="col-lg-2 col-md-3 col-6">
                        <h6 className="text-white fw-bold mb-3" style={{ letterSpacing: "0.03em" }}>Explore</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li>
                                <Link to="/" className="text-secondary text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1 small"></i> Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/university" className="text-secondary text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1 small"></i> Universities
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-secondary text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1 small"></i> About Platform
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-secondary text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1 small"></i> Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources & Support */}
                    <div className="col-lg-2 col-md-3 col-6">
                        <h6 className="text-white fw-bold mb-3" style={{ letterSpacing: "0.03em" }}>Support</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li>
                                <Link to="/support" className="text-secondary text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1 small"></i> Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-secondary text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1 small"></i> FAQs
                                </Link>
                            </li>
                            <li>
                                <Link to="/support-request" className="text-secondary text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1 small"></i> Submit Ticket
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-secondary text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1 small"></i> Student Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="col-lg-4 col-md-12">
                        <h6 className="text-white fw-bold mb-3" style={{ letterSpacing: "0.03em" }}>Stay Updated</h6>
                        <p className="small text-secondary mb-3">
                            Subscribe to receive the latest university rankings, scholarship alerts, and academic admissions news.
                        </p>
                        <form onSubmit={handleSubscribe} className="d-flex gap-2 mb-3">
                            <input
                                type="email"
                                className="form-control form-control-sm bg-dark text-white border-secondary"
                                placeholder="Enter student email..."
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                style={{ borderRadius: "8px" }}
                            />
                            <button type="submit" className="btn btn-sm btn-info text-white fw-bold px-3" style={{ borderRadius: "8px" }}>
                                Join
                            </button>
                        </form>
                        {/* Social Links */}
                        <div className="d-flex gap-2">
                            <a href="#twitter" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: "34px", height: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="bi bi-twitter-x"></i>
                            </a>
                            <a href="#linkedin" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: "34px", height: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="bi bi-linkedin"></i>
                            </a>
                            <a href="#github" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: "34px", height: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="bi bi-github"></i>
                            </a>
                            <a href="#instagram" className="btn btn-sm btn-outline-secondary rounded-circle" style={{ width: "34px", height: "34px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="bi bi-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="my-4 border-secondary opacity-25" />

                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small text-secondary">
                    <span>© {year} CampusConnect Academic Network. All rights reserved.</span>
                    <div className="d-flex gap-3">
                        <Link to="/about" className="text-secondary text-decoration-none">Privacy Policy</Link>
                        <span>•</span>
                        <Link to="/about" className="text-secondary text-decoration-none">Terms of Service</Link>
                        <span>•</span>
                        <Link to="/support" className="text-secondary text-decoration-none">Security</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;