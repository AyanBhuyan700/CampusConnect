import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const [user, setUser] = useState({ id: null, role: null });
    const navigate = useNavigate();

    useEffect(() => {
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role");

        if (id) {
            setUser({ id, role });
        }
    }, []);

    function handleLogout() {
        localStorage.clear();
        setUser({ id: null, role: null });
        navigate("/");
    }

    function renderMenu() {
        if (user?.role === "admin") {
            return (
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle text-white fw-bold" href="#" role="button" data-bs-toggle="dropdown">
                        Admin Panel
                    </a>
                    <ul className="dropdown-menu">
                        <li><Link className="dropdown-item" to="/universityAdmin">University Management</Link></li>
                        <li><Link className="dropdown-item" to="/userAdmin">User Management</Link></li>
                    </ul>
                </li>
            );
        } else {
            return (
                <>
                    <li className="nav-item">
                        <Link to="/" className="nav-link text-white fw-bold">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about" className="nav-link text-white fw-bold">About</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" className="nav-link text-white fw-bold">Contact</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/support" className="nav-link text-white fw-bold">Support</Link>
                    </li>
                </>
            );
        }
    }

    function renderAuthButtons() {
        if (user?.id) {
            return (
                <li className="nav-item">
                    <button className="btn btn-outline-light fw-bold" onClick={handleLogout}>Logout</button>
                </li>
            );
        } else {
            return (
                <>
                    <li className="nav-item">
                        <Link to="/register" className="nav-link text-white fw-bold">Register</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/login" className="nav-link text-white fw-bold">Login</Link>
                    </li>
                </>
            );
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-info shadow">
            <div className="container-fluid">
                {/* Logo Section */}
                <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" to="/">
                    University Portal
                </Link>

                {/* Toggle Button for Mobile */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Items */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto gap-3">
                        {renderMenu()}
                    </ul>
                    <ul className="navbar-nav ms-auto gap-3">
                        {renderAuthButtons()}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
