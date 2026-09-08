import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function CourseAdmin() {
  const query = useQuery();
  const departmentId = query.get("id");
  const departmentName = query.get("name") || "Department";
  const universityName = query.get("univ") || "University";
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ 
    name: "", 
    code: "", 
    price: "", 
    description: "", 
    duration: "", 
    image: null, 
    department: departmentId 
  });
  const [formError, setFormError] = useState({});

  useEffect(() => {
    if (departmentId) {
      getCoursesByDepartmentId();
    }
  }, [departmentId]);

  function getCoursesByDepartmentId() {
    setLoading(true);
    axios.get("https://campusconnect-1od1.onrender.com/courses?departmentId=" + departmentId)
      .then((c) => {
        const list = c.data.crsData || [];
        setCourses(list);
        setFilteredCourses(list);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Swal.fire("Error", "Unable to fetch courses from API", "error");
      });
  }

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCourses(courses);
    } else {
      const q = search.toLowerCase();
      setFilteredCourses(
        courses.filter(c => 
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.code && c.code.toLowerCase().includes(q)) ||
          (c.description && c.description.toLowerCase().includes(q))
        )
      );
    }
  }, [search, courses]);

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
    setForm({ name: "", code: "", price: "", description: "", duration: "", image: null, department: departmentId });
    setImagePreview(null);
    setCourseId(null);
    setFormError({});
    setShowForm(false);
  }

  function saveCourses() {
    let formData = new FormData();
    formData.append("name", form.name);
    formData.append("code", form.code);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("duration", form.duration);
    if (form.image) formData.append("image", form.image, form.image.name);
    formData.append("departmentId", departmentId);

    axios.post("https://campusconnect-1od1.onrender.com/courses", formData, {
      headers: { "content-type": "multipart/form-data" },
    }).then((c) => {
      Swal.fire("Success", c.data.message || "Course added successfully!", "success");
      getCoursesByDepartmentId();
      resetForm();
    }).catch(() => {
      Swal.fire("Error", "Unable to save course", "error");
    });
  }

  function updateCourses() {
    let formData = new FormData();
    formData.append("name", form.name);
    formData.append("code", form.code);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("duration", form.duration);
    if (form.image) formData.append("image", form.image, form.image.name);
    formData.append("departmentId", departmentId);
    formData.append("id", courseId);

    axios.put("https://campusconnect-1od1.onrender.com/courses", formData, {
      headers: { "content-type": "multipart/form-data" },
    }).then((c) => {
      Swal.fire("Success", c.data.message || "Course updated successfully!", "success");
      getCoursesByDepartmentId();
      resetForm();
    }).catch(() => {
      Swal.fire("Error", "Unable to update course", "error");
    });
  }

  function deleteCourse(id, name) {
    Swal.fire({
      title: `Delete ${name || "Course"}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete It",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete("https://campusconnect-1od1.onrender.com/courses", { data: { id: id } })
          .then((c) => {
            Swal.fire("Deleted!", c.data.message || "Course removed", "success");
            getCoursesByDepartmentId();
          })
          .catch(() => {
            Swal.fire("Error", "Unable to delete course", "error");
          });
      }
    });
  }

  function onCourseSubmit() {
    let errors = false;
    let err = {};

    if (!form.name.trim()) {
      errors = true;
      err.name = "Course name is required.";
    }

    if (!form.code.trim()) {
      errors = true;
      err.code = "Course code is required (e.g. CS-101).";
    }

    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) {
      errors = true;
      err.price = "Valid tuition price is required.";
    }

    if (!form.duration || isNaN(Number(form.duration)) || Number(form.duration) <= 0) {
      errors = true;
      err.duration = "Duration in weeks is required.";
    }

    if (!form.description.trim()) {
      errors = true;
      err.description = "Course description is required.";
    }

    if (!form.image && !courseId) {
      errors = true;
      err.image = "Course banner image is required.";
    }

    setFormError(err);

    if (errors) {
      Swal.fire("Validation Error", "Please fill all required fields correctly", "warning");
    } else {
      courseId ? updateCourses() : saveCourses();
    }
  }

  const startEdit = (course) => {
    setCourseId(course._id);
    setForm({
      name: course.name || "",
      code: course.code || "",
      price: course.price || "",
      description: course.description || "",
      duration: course.duration || "",
      image: null,
      department: departmentId
    });
    if (course.image) {
      setImagePreview(`https://campusconnect-1od1.onrender.com/${course.image}`);
    }
    setShowForm(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80";
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
              {departmentName} Courses
            </li>
          </ol>
        </nav>
        <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
          <i className="bi bi-arrow-left me-1"></i> Back to Department
        </button>
      </div>

      {/* Admin Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge-soft-primary mb-1">
            <i className="bi bi-book-fill"></i> Course Catalog Management
          </span>
          <h2 className="fw-bold text-dark mb-0">{departmentName}</h2>
        </div>
        <button 
          className={`btn ${showForm ? 'btn-outline-secondary' : 'btn-premium-primary'} d-flex align-items-center gap-2`}
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
        >
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-circle'}`}></i>
          {showForm ? "Close Form" : "Add Course"}
        </button>
      </div>

      {/* Expandable Add/Edit Form */}
      {showForm && (
        <div className="glass-card p-4 mb-4 shadow-lg animate-fade-in border-primary border-opacity-25">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h5 className="fw-bold text-dark mb-0">
              {courseId ? "Edit Course Information" : "Create New Course"}
            </h5>
            <button type="button" className="btn-close" onClick={resetForm}></button>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Course Title</label>
              <input
                type="text"
                className={`form-control ${formError.name ? 'is-invalid' : ''}`}
                name="name"
                value={form.name}
                onChange={changeHandler}
                placeholder="e.g. Distributed Systems & Cloud Computing"
              />
              {formError.name && <div className="text-danger small">{formError.name}</div>}
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold">Course Code</label>
              <input
                type="text"
                className={`form-control ${formError.code ? 'is-invalid' : ''}`}
                name="code"
                value={form.code}
                onChange={changeHandler}
                placeholder="CS-302"
              />
              {formError.code && <div className="text-danger small">{formError.code}</div>}
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold">Duration (Weeks)</label>
              <input
                type="number"
                className={`form-control ${formError.duration ? 'is-invalid' : ''}`}
                name="duration"
                value={form.duration}
                onChange={changeHandler}
                placeholder="16"
              />
              {formError.duration && <div className="text-danger small">{formError.duration}</div>}
            </div>

            <div className="col-md-2">
              <label className="form-label small fw-semibold">Tuition Price ($)</label>
              <input
                type="number"
                className={`form-control ${formError.price ? 'is-invalid' : ''}`}
                name="price"
                value={form.price}
                onChange={changeHandler}
                placeholder="850"
              />
              {formError.price && <div className="text-danger small">{formError.price}</div>}
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold">Course Description</label>
              <textarea
                className={`form-control ${formError.description ? 'is-invalid' : ''}`}
                name="description"
                rows="3"
                value={form.description}
                onChange={changeHandler}
                placeholder="Overview of core competencies, laboratory modules, and assessment criteria..."
              ></textarea>
              {formError.description && <div className="text-danger small">{formError.description}</div>}
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold">Course Banner Image</label>
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
                  <span className="small text-muted">Selected Course Image Preview</span>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="button" className="btn btn-light border px-4" onClick={resetForm}>
              Cancel
            </button>
            <button type="button" className="btn-premium-primary px-4" onClick={onCourseSubmit}>
              {courseId ? "Update Course" : "Save Course"}
            </button>
          </div>
        </div>
      )}

      {/* Courses Table Card */}
      <div className="glass-card p-3 p-md-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div className="input-icon-wrapper flex-grow-1" style={{ maxWidth: "360px" }}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search courses by name or code..."
              className="form-control form-control-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-muted small">
            Showing {filteredCourses.length} courses
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "70px" }}>Banner</th>
                <th>Course Name</th>
                <th>Code</th>
                <th>Duration</th>
                <th>Tuition</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Loading course catalog...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No courses registered in this department yet.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <img
                        src={getImageUrl(c.image)}
                        alt={c.name}
                        className="rounded-3 shadow-sm"
                        style={{ width: "55px", height: "40px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    </td>
                    <td className="fw-bold text-dark">{c.name}</td>
                    <td>
                      <span className="badge-soft-primary fw-bold">{c.code || "N/A"}</span>
                    </td>
                    <td className="small">{c.duration} Weeks</td>
                    <td className="fw-bold text-success">${c.price}</td>
                    <td className="small text-muted" style={{ maxWidth: "240px" }}>
                      {c.description ? (c.description.length > 50 ? c.description.slice(0, 50) + "..." : c.description) : "N/A"}
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          className="btn btn-sm btn-light border text-primary"
                          onClick={() => startEdit(c)}
                          title="Edit Course"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light border text-danger"
                          onClick={() => deleteCourse(c._id, c.name)}
                          title="Delete Course"
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

export default CourseAdmin;
