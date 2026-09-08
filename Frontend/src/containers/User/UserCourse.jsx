import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserCourse() {
    const query = useQuery();
    const departmentId = query.get("id");
    const departmentName = query.get("name") || "Department";
    const universityName = query.get("univ") || "University";

    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (departmentId) {
            getCourseByDepartmentId();
        }
    }, [departmentId]);

    function getCourseByDepartmentId() {
        setLoading(true);
        axios
            .get("https://campusconnect-1od1.onrender.com/courses?departmentId=" + departmentId)
            .then((response) => {
                const data = response.data.crsData || [];
                setCourses(data);
                setFilteredCourses(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching courses:", err.message);
                setLoading(false);
            });
    }

    useEffect(() => {
        const filtered = courses.filter((course) =>
            course.name.toLowerCase().includes(search.toLowerCase()) ||
            (course.code && course.code.toLowerCase().includes(search.toLowerCase())) ||
            (course.description && course.description.toLowerCase().includes(search.toLowerCase()))
        );
        setFilteredCourses(filtered);
    }, [search, courses]);

    const handleApplyClick = (course) => {
        Swal.fire({
            title: `Inquire About ${course.name}`,
            html: `
                <div class="text-start">
                    <p><strong>Code:</strong> ${course.code || "N/A"}</p>
                    <p><strong>Duration:</strong> ${course.duration} Weeks</p>
                    <p><strong>Tuition Fee:</strong> $${course.price}</p>
                    <p class="text-muted small">${course.description || "Inquire with department administration for syllabus and enrollment criteria."}</p>
                </div>
            `,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#4f46e5",
            confirmButtonText: "Submit Inquiry",
            cancelButtonText: "Close"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Inquiry Sent!",
                    text: "The department admissions office will review your request and contact you via email.",
                    timer: 2500,
                    showConfirmButton: false
                });
            }
        });
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80";
        if (imagePath.startsWith("http")) return imagePath;
        return `https://campusconnect-1od1.onrender.com/${imagePath}`;
    };

    const columns = [
        {
            name: "Course",
            selector: (row) => (
                <img
                    src={getImageUrl(row.image)}
                    alt={row.name}
                    className="rounded-3 shadow-sm my-2"
                    style={{ width: "70px", height: "50px", objectFit: "cover" }}
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80";
                    }}
                />
            ),
            width: "100px",
        },
        { 
            name: "Course Title", 
            selector: (row) => row.name, 
            sortable: true,
            cell: (row) => (
                <div>
                    <div className="fw-bold text-dark">{row.name}</div>
                    <small className="text-muted">{row.description ? row.description.substring(0, 60) + '...' : ''}</small>
                </div>
            ),
            grow: 2
        },
        { 
            name: "Code", 
            selector: (row) => row.code || "N/A", 
            sortable: true,
            cell: (row) => (
                <span className="badge-soft-primary fw-bold">{row.code || "N/A"}</span>
            )
        },
        { 
            name: "Duration", 
            selector: (row) => Number(row.duration) || 0, 
            sortable: true,
            cell: (row) => (
                <span className="badge-soft-cyan">
                    <i className="bi bi-clock small"></i> {row.duration} Weeks
                </span>
            )
        },
        { 
            name: "Tuition Fee", 
            selector: (row) => Number(row.price) || 0, 
            sortable: true,
            cell: (row) => (
                <span className="fw-bold text-success">${row.price}</span>
            )
        },
        {
            name: "Actions",
            cell: (row) => (
                <button
                    className="btn-premium-primary btn-sm py-1 px-3"
                    onClick={() => handleApplyClick(row)}
                >
                    Inquire
                </button>
            ),
            right: true
        },
    ];

    return (
        <div className="container py-5">
            {/* Breadcrumb Header */}
            <div className="breadcrumb-container d-flex flex-wrap align-items-center justify-content-between gap-2">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 small fw-medium">
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-decoration-none text-muted">
                                <i className="bi bi-house-door me-1"></i>Home
                            </Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/university" className="text-decoration-none text-muted">
                                Universities
                            </Link>
                        </li>
                        <li className="breadcrumb-item active text-primary fw-bold" aria-current="page">
                            {departmentName} Courses
                        </li>
                    </ol>
                </nav>
                <Link to="/university" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                    <i className="bi bi-arrow-left me-1"></i> Back to Directory
                </Link>
            </div>

            {/* Page Title & Subtitle */}
            <div className="mb-4">
                <span className="section-badge">
                    <i className="bi bi-journal-check"></i> Course Catalog
                </span>
                <h2 className="section-title mb-2">{departmentName}</h2>
                <p className="text-muted">
                    Explore available courses, syllabus highlights, durations, and tuition for {departmentName} at {universityName}.
                </p>
            </div>

            {/* Filter and View Toggle Controls */}
            <div className="glass-card p-3 mb-4">
                <div className="row g-3 align-items-center justify-content-between">
                    <div className="col-md-6 col-lg-5">
                        <div className="input-icon-wrapper">
                            <i className="bi bi-search"></i>
                            <input
                                type="text"
                                placeholder="Search course by name, code, or topic..."
                                className="form-control"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="col-md-6 col-lg-4 d-flex justify-content-md-end align-items-center gap-3">
                        <span className="text-muted small">
                            <strong>{filteredCourses.length}</strong> courses available
                        </span>
                        <div className="d-inline-flex shadow-sm rounded-3 overflow-hidden">
                            <button
                                type="button"
                                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <i className="bi bi-grid-fill"></i> Grid
                            </button>
                            <button
                                type="button"
                                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                                onClick={() => setViewMode('table')}
                            >
                                <i className="bi bi-list-ul"></i> Table
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Rendering */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status"></div>
                    <p className="text-muted fw-medium">Loading course catalog...</p>
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="glass-card text-center p-5 my-4">
                    <div 
                        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-muted mb-3"
                        style={{ width: "72px", height: "72px", fontSize: "2rem" }}
                    >
                        <i className="bi bi-journal-x"></i>
                    </div>
                    <h4 className="fw-bold text-dark">No Courses Found</h4>
                    <p className="text-muted mx-auto" style={{ maxWidth: "450px" }}>
                        No courses currently match your criteria in this department. Check back soon or contact department admissions directly.
                    </p>
                    <Link to="/university" className="btn btn-outline-primary rounded-pill px-4 mt-2 fw-semibold">
                        Explore Other Departments
                    </Link>
                </div>
            ) : viewMode === "grid" ? (
                <div className="row g-4 animate-fade-in">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="col-lg-4 col-md-6">
                            <div className="university-card">
                                {/* Course Image Banner */}
                                <div className="university-card-img-wrapper" style={{ height: "160px" }}>
                                    <img
                                        src={getImageUrl(course.image)}
                                        alt={course.name}
                                        className="university-card-img"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80";
                                        }}
                                    />
                                    {course.code && (
                                        <div 
                                            className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-white px-2.5 py-1.5 rounded-pill shadow-sm small fw-semibold"
                                            style={{ backdropFilter: "blur(4px)" }}
                                        >
                                            {course.code}
                                        </div>
                                    )}
                                    {course.price && (
                                        <div 
                                            className="position-absolute bottom-0 end-0 m-3 badge bg-white text-success px-2.5 py-1 rounded-pill shadow-sm small fw-bold"
                                        >
                                            ${course.price}
                                        </div>
                                    )}
                                </div>

                                {/* Course Details */}
                                <div className="p-4 d-flex flex-column flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <span className="badge-soft-cyan">
                                            <i className="bi bi-clock"></i> {course.duration} Weeks
                                        </span>
                                    </div>

                                    <h5 className="fw-bold text-dark mb-2">{course.name}</h5>
                                    
                                    <p className="text-secondary small mb-4 flex-grow-1" style={{ lineHeight: "1.6" }}>
                                        {course.description || "Comprehensive curriculum covering key theoretical and practical frameworks in this discipline."}
                                    </p>

                                    {/* Action Button */}
                                    <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light mt-auto">
                                        <span className="text-muted small">Accredited Program</span>
                                        <button
                                            className="btn-premium-primary btn-sm py-1.5 px-3 rounded-pill"
                                            onClick={() => handleApplyClick(course)}
                                        >
                                            Inquire Program <i className="bi bi-arrow-right-short"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-2 p-md-3 animate-fade-in shadow-sm">
                    <DataTable
                        columns={columns}
                        data={filteredCourses}
                        pagination
                        highlightOnHover
                        responsive
                    />
                </div>
            )}
        </div>
    );
}

export default UserCourse;
