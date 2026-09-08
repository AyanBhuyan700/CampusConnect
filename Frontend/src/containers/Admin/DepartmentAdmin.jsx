import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function DepartmentAdmin() {
  const query = useQuery();
  const universityId = query.get("id");
  const universityName = query.get("name") || "University";
  const navigate = useNavigate();

  const [departmentId, setDepartmentId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ 
    name: "", 
    phoneNumber: "", 
    facultyCount: "", 
    image: null, 
    university: universityId 
  });
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (universityId) {
      getDepartmentByUniversityId();
    }
  }, [universityId]);

  function getDepartmentByUniversityId() {
    setLoading(true);
    axios.get("https://campusconnect-1od1.onrender.com/department?universityId=" + universityId)
      .then((d) => {
        const list = d.data.depData || [];
        setDepartments(list);
        setFilteredDepartments(list);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Swal.fire("Error", "Unable to fetch departments from API", "error");
      });
  }

  useEffect(() => {
    if (!search.trim()) {
      setFilteredDepartments(departments);
    } else {
      const q = search.toLowerCase();
      setFilteredDepartments(
        departments.filter(d => 
          (d.name && d.name.toLowerCase().includes(q)) ||
          (d.phoneNumber && d.phoneNumber.toLowerCase().includes(q))
        )
      );
    }
  }, [search, departments]);

  const changeHandler = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value
    }));
    if (formError[e.target.name]) {
      setFormError(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setForm(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  function resetForm() {
    setForm({ name: "", phoneNumber: "", facultyCount: "", image: null, university: universityId });
    setImagePreview(null);
    setDepartmentId(null);
    setFormError({});
    setShowForm(false);
  }

  function saveDepartment() {
    let formData = new FormData();
    formData.append("name", form.name);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("facultyCount", form.facultyCount);
    if (form.image) formData.append("image", form.image, form.image.name);
    formData.append("universityId", universityId);

    axios.post("https://campusconnect-1od1.onrender.com/department", formData, {
      headers: { "content-type": "multipart/form-data" },
    }).then((d) => {
      Swal.fire("Success", d.data.message || "Department added!", "success");
      getDepartmentByUniversityId();
      resetForm();
    }).catch(() => {
      Swal.fire("Error", "Unable to save department", "error");
    });
  }

  function updateDepartment() {
    let formData = new FormData();
    formData.append("name", form.name);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("facultyCount", form.facultyCount);
    if (form.image) formData.append("image", form.image, form.image.name);
    formData.append("universityId", universityId);
    formData.append("id", departmentId);

    axios.put("https://campusconnect-1od1.onrender.com/department", formData, {
      headers: { "content-type": "multipart/form-data" },
    }).then((d) => {
      Swal.fire("Success", d.data.message || "Department updated!", "success");
      getDepartmentByUniversityId();
      resetForm();
    }).catch(() => {
      Swal.fire("Error", "Something went wrong while updating", "error");
    });
  }

  function deleteDepartment(id, name) {
    Swal.fire({
      title: `Delete ${name || "Department"}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete It",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete("https://campusconnect-1od1.onrender.com/department", { data: { id: id } })
          .then((d) => {
            Swal.fire("Deleted!", d.data.message || "Department removed", "success");
            getDepartmentByUniversityId();
          })
          .catch(() => {
            Swal.fire("Error", "Unable to delete department", "error");
          });
      }
    });
  }

  function onDepartmentSubmit() {
    let errors = false;
    let err = {};

    if (!form.name.trim()) {
      errors = true;
      err.name = "Department name is required.";
    }

    if (!String(form.phoneNumber).trim()) {
      errors = true;
      err.phoneNumber = "Phone number is required.";
    }

    if (!form.facultyCount || isNaN(Number(form.facultyCount)) || Number(form.facultyCount) <= 0) {
      errors = true;
      err.facultyCount = "Faculty count must be a valid positive number.";
    }

    if (!form.image && !departmentId) {
      errors = true;
      err.image = "Department image is required.";
    }

    setFormError(err);

    if (errors) {
      Swal.fire("Validation Error", "Please fill all required fields correctly", "warning");
    } else {
      departmentId ? updateDepartment() : saveDepartment();
    }
  }

  const startEdit = (dept) => {
    setDepartmentId(dept._id);
    setForm({
      name: dept.name || "",
      phoneNumber: dept.phoneNumber || "",
      facultyCount: dept.facultyCount || "",
      image: null,
      university: universityId
    });
    if (dept.image) {
      setImagePreview(`https://campusconnect-1od1.onrender.com/${dept.image}`);
    }
    setShowForm(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://campusconnect-1od1.onrender.com/${imagePath}`;
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-container d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0 small fw-medium">
            <li className="breadcrumb-item">
              <Link to="/universityAdmin" className="text-decoration-none text-muted">
                <i className="bi bi-shield-lock me-1"></i>University Admin
              </Link>
            </li>
            <li className="breadcrumb-item active text-primary fw-bold" aria-current="page">
              {universityName} Departments
            </li>
          </ol>
        </nav>
        <Link to="/universityAdmin" className="btn btn-sm btn-outline-secondary rounded-pill px-3">
          <i className="bi bi-arrow-left me-1"></i> Back to University Admin
        </Link>
      </div>

      {/* Admin Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge-soft-success mb-1">
            <i className="bi bi-diagram-3-fill"></i> Department Management
          </span>
          <h2 className="fw-bold text-dark mb-0">{universityName}</h2>
        </div>
        <button 
          className={`btn ${showForm ? 'btn-outline-secondary' : 'btn-premium-primary'} d-flex align-items-center gap-2`}
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
        >
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-circle'}`}></i>
          {showForm ? "Close Form" : "Add Department"}
        </button>
      </div>

      {/* Expandable Add/Edit Form */}
      {showForm && (
        <div className="glass-card p-4 mb-4 shadow-lg animate-fade-in border-success border-opacity-25">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h5 className="fw-bold text-dark mb-0">
              {departmentId ? "Edit Department Details" : "Create New Department"}
            </h5>
            <button type="button" className="btn-close" onClick={resetForm}></button>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Department Name</label>
              <input
                type="text"
                className={`form-control ${formError.name ? 'is-invalid' : ''}`}
                name="name"
                value={form.name}
                onChange={changeHandler}
                placeholder="e.g. Department of Computer Science"
              />
              {formError.name && <div className="text-danger small">{formError.name}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold">Contact Phone</label>
              <input
                type="text"
                className={`form-control ${formError.phoneNumber ? 'is-invalid' : ''}`}
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={changeHandler}
                placeholder="e.g. +1 617-555-0199"
              />
              {formError.phoneNumber && <div className="text-danger small">{formError.phoneNumber}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label small fw-semibold">Faculty Headcount</label>
              <input
                type="number"
                className={`form-control ${formError.facultyCount ? 'is-invalid' : ''}`}
                name="facultyCount"
                value={form.facultyCount}
                onChange={changeHandler}
                placeholder="e.g. 45"
              />
              {formError.facultyCount && <div className="text-danger small">{formError.facultyCount}</div>}
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold">Department Banner Image</label>
              <input
                type="file"
                className={`form-control ${formError.image ? 'is-invalid' : ''}`}
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formError.image && <div className="text-danger small">{formError.image}</div>}

              {imagePreview && (
                <div className="mt-2 d-flex align-items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-3 border shadow-sm"
                    style={{ width: "120px", height: "80px", objectFit: "cover" }}
                  />
                  <span className="small text-muted">Selected Department Image</span>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="button" className="btn btn-light border px-4" onClick={resetForm}>
              Cancel
            </button>
            <button type="button" className="btn-premium-primary px-4" onClick={onDepartmentSubmit}>
              {departmentId ? "Update Department" : "Save Department"}
            </button>
          </div>
        </div>
      )}

      {/* Departments Table Card */}
      <div className="glass-card p-3 p-md-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div className="input-icon-wrapper flex-grow-1" style={{ maxWidth: "360px" }}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search departments..."
              className="form-control form-control-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-muted small">
            Showing {filteredDepartments.length} departments
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "80px" }}>Image</th>
                <th>Department Name</th>
                <th>Phone Contact</th>
                <th>Faculty Count</th>
                <th>Courses</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Loading departments...
                  </td>
                </tr>
              ) : filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No departments added yet for this university.
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="rounded-3 shadow-sm"
                        style={{ width: "60px", height: "45px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </td>
                    <td className="fw-bold text-dark">{item.name}</td>
                    <td className="text-muted small">
                      <i className="bi bi-telephone text-primary me-1"></i>
                      {item.phoneNumber || "N/A"}
                    </td>
                    <td>
                      <span className="badge-soft-success fw-bold">
                        {item.facultyCount}+ Faculty
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 small fw-semibold"
                        onClick={() => navigate(`/courseAdmin?id=${item._id}&name=${encodeURIComponent(item.name)}&univ=${encodeURIComponent(universityName)}`)}
                      >
                        <i className="bi bi-book"></i> Manage Courses
                      </button>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          className="btn btn-sm btn-light border text-primary"
                          onClick={() => startEdit(item)}
                          title="Edit Department"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light border text-danger"
                          onClick={() => deleteDepartment(item._id, item.name)}
                          title="Delete Department"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DepartmentAdmin;
