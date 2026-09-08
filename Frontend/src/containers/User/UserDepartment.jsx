import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserDepartment() {
  const query = useQuery();
  const universityId = query.get("id");
  const universityName = query.get("name") || "University";
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (universityId) {
      getDepartmentsByUniversityId();
    }
  }, [universityId]);

  function getDepartmentsByUniversityId() {
    setLoading(true);
    axios
      .get("https://campusconnect-1od1.onrender.com/department?universityId=" + universityId)
      .then((response) => {
        const data = response.data.depData || [];
        setDepartments(data);
        setFilteredDepartments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching departments:", err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    const filtered = departments.filter((dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase()) ||
      (dept.phoneNumber && dept.phoneNumber.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredDepartments(filtered);
  }, [search, departments]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://campusconnect-1od1.onrender.com/${imagePath}`;
  };

  const columns = [
    {
      name: "Image",
      selector: (row) => (
        <img
          src={getImageUrl(row.image)}
          alt={row.name}
          className="rounded-3 shadow-sm my-2"
          style={{ width: "80px", height: "60px", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80";
          }}
        />
      ),
      width: "110px",
    },
    { 
      name: "Department Name", 
      selector: (row) => row.name, 
      sortable: true,
      cell: (row) => (
        <span className="fw-bold text-dark">{row.name}</span>
      )
    },
    { 
      name: "Phone Contact", 
      selector: (row) => row.phoneNumber || "N/A", 
      sortable: true,
      cell: (row) => (
        <span className="text-secondary small d-inline-flex align-items-center gap-1">
          <i className="bi bi-telephone-fill text-primary small"></i> {row.phoneNumber || "N/A"}
        </span>
      )
    },
    { 
      name: "Faculty Size", 
      selector: (row) => row.facultyCount || 0, 
      sortable: true,
      cell: (row) => (
        <span className="badge-soft-success">
          <i className="bi bi-person-badge-fill small"></i> {row.facultyCount}+ Faculty
        </span>
      )
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="btn-premium-primary btn-sm py-1 px-3"
          onClick={() => navigate(`/userCourse?id=${row._id}&name=${encodeURIComponent(row.name)}&univ=${encodeURIComponent(universityName)}`)}
        >
          Courses <i className="bi bi-arrow-right-short"></i>
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
              {universityName} Departments
            </li>
          </ol>
        </nav>
        <Link to="/university" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
          <i className="bi bi-arrow-left me-1"></i> Back to Universities
        </Link>
      </div>

      {/* Page Title & Subtitle */}
      <div className="mb-4">
        <span className="section-badge">
          <i className="bi bi-diagram-3-fill"></i> Academic Faculties
        </span>
        <h2 className="section-title mb-2">{universityName}</h2>
        <p className="text-muted">
          Browse all specialized departments, faculty leadership, and available courses under this institution.
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
                placeholder="Search department name or phone..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 col-lg-4 d-flex justify-content-md-end align-items-center gap-3">
            <span className="text-muted small">
              <strong>{filteredDepartments.length}</strong> departments found
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
          <p className="text-muted fw-medium">Loading department faculties...</p>
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="glass-card text-center p-5 my-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-muted mb-3"
            style={{ width: "72px", height: "72px", fontSize: "2rem" }}
          >
            <i className="bi bi-diagram-3"></i>
          </div>
          <h4 className="fw-bold text-dark">No Departments Listed Yet</h4>
          <p className="text-muted mx-auto" style={{ maxWidth: "450px" }}>
            No departments were found matching this search or this institution has not published departments yet.
          </p>
          <Link to="/university" className="btn btn-outline-primary rounded-pill px-4 mt-2 fw-semibold">
            Explore Other Universities
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="row g-4 animate-fade-in">
          {filteredDepartments.map((dept) => (
            <div key={dept._id} className="col-lg-4 col-md-6">
              <div className="university-card">
                {/* Department Image */}
                <div className="university-card-img-wrapper" style={{ height: "160px" }}>
                  <img
                    src={getImageUrl(dept.image)}
                    alt={dept.name}
                    className="university-card-img"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  {dept.facultyCount && (
                    <div 
                      className="position-absolute top-0 end-0 m-3 badge bg-white text-dark shadow-sm px-2.5 py-1 rounded-pill small fw-bold"
                    >
                      <i className="bi bi-people-fill text-primary me-1"></i>
                      {dept.facultyCount}+ Faculty
                    </div>
                  )}
                </div>

                {/* Card Details */}
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h5 className="fw-bold text-dark mb-2">{dept.name}</h5>
                  
                  <div className="d-flex align-items-center gap-2 text-muted small mb-4">
                    <i className="bi bi-telephone-fill text-primary"></i>
                    <span>{dept.phoneNumber || "Direct phone not listed"}</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light mt-auto">
                    <span className="badge-soft-cyan">
                      Active Faculty
                    </span>
                    <button
                      className="btn-premium-primary btn-sm py-1.5 px-3 rounded-pill"
                      onClick={() => navigate(`/userCourse?id=${dept._id}&name=${encodeURIComponent(dept.name)}&univ=${encodeURIComponent(universityName)}`)}
                    >
                      View Courses <i className="bi bi-arrow-right-short"></i>
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
            data={filteredDepartments}
            pagination
            highlightOnHover
            responsive
          />
        </div>
      )}
    </div>
  );
}

export default UserDepartment;
