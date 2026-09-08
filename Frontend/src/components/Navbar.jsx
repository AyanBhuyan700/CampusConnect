import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
    const [user, setUser] = useState({ id: null, role: null });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role");

        if (id) {
            setUser({ id, role });
        }
    }, [location]);

    function handleLogout() {
        localStorage.clear();
        setUser({ id: null, role: null });
        navigate("/");
    }

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top py-3">
            <div className="container">
                {/* Brand Logo */}
                <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
                    <div 
                        className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                        style={{
                            width: "40px",
                            height: "40px",
                            background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                            color: "#fff"
                        }}
                    >
                        <i className="bi bi-mortarboard-fill fs-5"></i>
                    </div>
                    <div className="d-flex flex-column">
                        <span className="fw-extrabold fs-4 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}>
                            Campus<span style={{ color: "#06b6d4" }}>Connect</span>
                        </span>
                    </div>
                </Link>

                {/* Mobile Hamburger Toggler */}
                <button 
                    className="navbar-toggler border-0 shadow-none px-2" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarMain"
                    aria-controls="navbarMain"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarMain">
                    <ul className="navbar-nav mx-auto gap-1 my-2 my-lg-0">
                        <li className="nav-item">
                            <Link to="/" className={`nav-link-custom ${isActive('/') ? 'active' : ''}`}>
                                <i className="bi bi-house-door"></i> Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/university" className={`nav-link-custom ${isActive('/university') ? 'active' : ''}`}>
                                <i className="bi bi-buildings"></i> Universities
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/about" className={`nav-link-custom ${isActive('/about') ? 'active' : ''}`}>
                                <i className="bi bi-info-circle"></i> About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/contact" className={`nav-link-custom ${isActive('/contact') ? 'active' : ''}`}>
                                <i className="bi bi-envelope"></i> Contact
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/support" className={`nav-link-custom ${isActive('/support') ? 'active' : ''}`}>
                                <i className="bi bi-headset"></i> Support
                            </Link>
                        </li>

                        {/* Admin Panel Dropdown if user is Admin */}
                        {user?.role === "admin" && (
                            <li className="nav-item dropdown">
                                <a 
                                    className="nav-link-custom dropdown-toggle text-warning fw-semibold" 
                                    href="#" 
                                    role="button" 
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bi bi-shield-lock-fill"></i> Admin Panel
                                </a>
                                <ul className="dropdown-menu dropdown-menu-dark shadow-lg border-secondary py-2">
                                    <li>
                                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/universityAdmin">
                                            <i className="bi bi-building-gear text-info"></i> University Admin
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/departmentAdmin">
                                            <i className="bi bi-diagram-3 text-success"></i> Department Admin
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/courseAdmin">
                                            <i className="bi bi-book text-warning"></i> Course Admin
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider border-secondary" /></li>
                                    <li>
                                        <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/userAdmin">
                                            <i className="bi bi-people text-danger"></i> User Management
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>

                    {/* Auth Actions */}
                    <div className="d-flex align-items-center gap-2 pt-2 pt-lg-0">
                        {user?.id ? (
                            <div className="d-flex align-items-center gap-3">
                                <div className="d-flex align-items-center gap-2 bg-dark px-3 py-1 rounded-pill border border-secondary">
                                    <div className="pulse-dot"></div>
                                    <span className="text-light small fw-semibold text-capitalize">
                                        {user.role || "User"}
                                    </span>
                                </div>
                                <button 
                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 px-3 py-1 rounded-pill fw-semibold" 
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-box-arrow-right"></i> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
                                <Link 
                                    to="/login" 
                                    className="btn btn-sm btn-outline-light px-3 py-1 rounded-pill fw-semibold d-flex align-items-center gap-1"
                                >
                                    <i className="bi bi-box-arrow-in-right"></i> Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="btn-premium-accent btn-sm py-1 px-3 rounded-pill fw-semibold"
                                >
                                    Get Started <i className="bi bi-arrow-right-short"></i>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
