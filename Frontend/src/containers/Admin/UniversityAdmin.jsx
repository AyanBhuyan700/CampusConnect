import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function UniversityAdmin() {
    const [universityId, setUniversityId] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({ 
        name: "", 
        location: "", 
        foundedYear: "", 
        website: "", 
        ranking: "", 
        image: null 
    });
    const [formError, setFormError] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getUniversities();
    }, []);

    const getUniversities = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("https://campusconnect-1od1.onrender.com/university");
            const list = data.univData || [];
            setUniversities(list);
            setFilteredUniversities(list);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Swal.fire("Error", "Unable to fetch universities", "error");
        }
    };

    useEffect(() => {
        if (!search.trim()) {
            setFilteredUniversities(universities);
        } else {
            const q = search.toLowerCase();
            setFilteredUniversities(
                universities.filter(u => 
                    (u.name && u.name.toLowerCase().includes(q)) ||
                    (u.location && u.location.toLowerCase().includes(q)) ||
                    String(u.ranking).includes(q) ||
                    String(u.foundedYear).includes(q)
                )
            );
        }
    }, [search, universities]);

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (formError[e.target.name]) {
            setFormError(prev => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setForm({ ...form, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!form.name.trim()) errors.name = "University name is required.";
        if (!form.location.trim()) errors.location = "Location is required.";
        if (!String(form.foundedYear).trim()) errors.foundedYear = "Valid year required.";
        if (!/^https?:\/\/.+/.test(form.website)) errors.website = "Valid URL (http:// or https://) required.";
        if (!String(form.ranking).trim()) errors.ranking = "Valid ranking number required.";
        if (!form.image && !universityId) errors.image = "Campus image is required.";

        setFormError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (form[key]) formData.append(key, form[key]);
        });
        if (universityId) formData.append("id", universityId);

        try {
            const response = universityId
                ? await axios.put("https://campusconnect-1od1.onrender.com/university", formData, { headers: { "Content-Type": "multipart/form-data" } })
                : await axios.post("https://campusconnect-1od1.onrender.com/university", formData, { headers: { "Content-Type": "multipart/form-data" } });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: response.data.message || "University saved successfully!",
                timer: 2000,
                showConfirmButton: false
            });
            getUniversities();
            resetForm();
        } catch (error) {
            Swal.fire("Error", "Something went wrong while saving", "error");
        }
    };

    const startEdit = (univ) => {
        setUniversityId(univ._id);
        setForm({
            name: univ.name || "",
            location: univ.location || "",
            foundedYear: univ.foundedYear || "",
            website: univ.website || "",
            ranking: univ.ranking || "",
            image: null
        });
        if (univ.image) {
            setImagePreview(`https://campusconnect-1od1.onrender.com/${univ.image}`);
        }
        setShowForm(true);
        window.scrollTo({ top: 120, behavior: 'smooth' });
    };

    const resetForm = () => {
        setUniversityId(null);
        setForm({ name: "", location: "", foundedYear: "", website: "", ranking: "", image: null });
        setImagePreview(null);
        setFormError({});
        setShowForm(false);
    };

    const deleteUniversity = async (id, name) => {
        Swal.fire({
            title: `Delete ${name}?`,
            text: "This action will permanently delete this institution record and all associated departments.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Yes, Delete It",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await axios.delete("https://campusconnect-1od1.onrender.com/university", { data: { id } });
                    Swal.fire("Deleted!", data.message || "University removed.", "success");
                    getUniversities();
                } catch (error) {
                    Swal.fire("Error", "Something went wrong while deleting", "error");
                }
            }
        });
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80";
        if (imagePath.startsWith("http")) return imagePath;
        return `https://campusconnect-1od1.onrender.com/${imagePath}`;
    };

    return (
        <div className="container py-4">
            {/* Admin Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <span className="badge-soft-primary mb-1">
                        <i className="bi bi-shield-lock-fill"></i> Admin Console
                    </span>
                    <h2 className="fw-bold text-dark mb-0">University Management</h2>
                </div>
                <div className="d-flex gap-2">
                    <button 
                        className={`btn ${showForm ? 'btn-outline-secondary' : 'btn-premium-primary'} d-flex align-items-center gap-2`}
                        onClick={() => {
                            if (showForm) resetForm();
                            else setShowForm(true);
                        }}
                    >
                        <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-circle'}`}></i>
                        {showForm ? "Close Form" : "Add New University"}
                    </button>
                </div>
            </div>

            {/* Quick Stats Overview Row */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="stat-box d-flex align-items-center justify-content-between p-3">
                        <div className="text-start">
                            <div className="stat-number fs-3">{universities.length}</div>
                            <div className="stat-label mt-0">Total Universities</div>
                        </div>
                        <i className="bi bi-buildings-fill fs-1 text-primary opacity-25"></i>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stat-box d-flex align-items-center justify-content-between p-3">
                        <div className="text-start">
                            <div className="stat-number fs-3 text-success">
                                {universities.filter(u => Number(u.ranking) <= 50).length}
                            </div>
                            <div className="stat-label mt-0">Top 50 Global Ranked</div>
                        </div>
                        <i className="bi bi-trophy-fill fs-1 text-success opacity-25"></i>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="stat-box d-flex align-items-center justify-content-between p-3">
                        <div className="text-start">
                            <div className="stat-number fs-3 text-info">Live</div>
                            <div className="stat-label mt-0">Directory Sync Status</div>
                        </div>
                        <i className="bi bi-cloud-check-fill fs-1 text-info opacity-25"></i>
                    </div>
                </div>
            </div>

            {/* Expandable Add/Edit Form */}
            {showForm && (
                <div className="glass-card p-4 mb-4 shadow-lg animate-fade-in border-primary border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                        <h5 className="fw-bold text-dark mb-0">
                            {universityId ? "Edit University Record" : "Add New University"}
                        </h5>
                        <button type="button" className="btn-close" onClick={resetForm}></button>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-semibold">University Name</label>
                            <input
                                type="text"
                                className={`form-control ${formError.name ? 'is-invalid' : ''}`}
                                name="name"
                                value={form.name}
                                onChange={changeHandler}
                                placeholder="e.g. Harvard University"
                            />
                            {formError.name && <div className="text-danger small">{formError.name}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small fw-semibold">Location / Country</label>
                            <input
                                type="text"
                                className={`form-control ${formError.location ? 'is-invalid' : ''}`}
                                name="location"
                                value={form.location}
                                onChange={changeHandler}
                                placeholder="e.g. Cambridge, Massachusetts, USA"
                            />
                            {formError.location && <div className="text-danger small">{formError.location}</div>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold">Founded Year</label>
                            <input
                                type="number"
                                className={`form-control ${formError.foundedYear ? 'is-invalid' : ''}`}
                                name="foundedYear"
                                value={form.foundedYear}
                                onChange={changeHandler}
                                placeholder="e.g. 1636"
                            />
                            {formError.foundedYear && <div className="text-danger small">{formError.foundedYear}</div>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold">Global Ranking</label>
                            <input
                                type="number"
                                className={`form-control ${formError.ranking ? 'is-invalid' : ''}`}
                                name="ranking"
                                value={form.ranking}
                                onChange={changeHandler}
                                placeholder="e.g. 1"
                            />
                            {formError.ranking && <div className="text-danger small">{formError.ranking}</div>}
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-semibold">Official Website</label>
                            <input
                                type="url"
                                className={`form-control ${formError.website ? 'is-invalid' : ''}`}
                                name="website"
                                value={form.website}
                                onChange={changeHandler}
                                placeholder="https://www.harvard.edu"
                            />
                            {formError.website && <div className="text-danger small">{formError.website}</div>}
                        </div>

                        <div className="col-md-12">
                            <label className="form-label small fw-semibold">Campus Image</label>
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
                                    <span className="small text-muted">Selected Campus Image Preview</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                        <button type="button" className="btn btn-light border px-4" onClick={resetForm}>
                            Cancel
                        </button>
                        <button type="button" className="btn-premium-primary px-4" onClick={handleSubmit}>
                            {universityId ? "Update University" : "Save University"}
                        </button>
                    </div>
                </div>
            )}

            {/* Table Card */}
            <div className="glass-card p-3 p-md-4 shadow-sm">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                    <div className="input-icon-wrapper flex-grow-1" style={{ maxWidth: "360px" }}>
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Filter universities by name, country, rank..."
                            className="form-control form-control-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <span className="text-muted small">
                        Showing {filteredUniversities.length} records
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: "80px" }}>Campus</th>
                                <th>University Name</th>
                                <th>Location</th>
                                <th>Founded</th>
                                <th>Ranking</th>
                                <th>Website</th>
                                <th>Departments</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-muted">
                                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                        Loading universities...
                                    </td>
                                </tr>
                            ) : filteredUniversities.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-muted">
                                        No universities found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUniversities.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                className="rounded-3 shadow-sm"
                                                style={{ width: "60px", height: "45px", objectFit: "cover" }}
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80";
                                                }}
                                            />
                                        </td>
                                        <td className="fw-bold text-dark">{item.name}</td>
                                        <td className="text-muted small">
                                            <i className="bi bi-geo-alt text-danger me-1"></i>
                                            {item.location}
                                        </td>
                                        <td className="small">{item.foundedYear || "N/A"}</td>
                                        <td>
                                            <span className="badge-soft-warning fw-bold">
                                                #{item.ranking || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            {item.website ? (
                                                <a href={item.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-link text-decoration-none p-0 fw-semibold">
                                                    Visit <i className="bi bi-box-arrow-up-right small"></i>
                                                </a>
                                            ) : <span className="text-muted small">N/A</span>}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-success rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 small fw-semibold"
                                                onClick={() => navigate(`/departmentAdmin?id=${item._id}&name=${encodeURIComponent(item.name)}`)}
                                            >
                                                <i className="bi bi-plus-lg"></i> Manage Depts
                                            </button>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-inline-flex gap-1">
                                                <button
                                                    className="btn btn-sm btn-light border text-primary"
                                                    onClick={() => startEdit(item)}
                                                    title="Edit Record"
                                                >
                                                    <i className="bi bi-pencil-fill"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-light border text-danger"
                                                    onClick={() => deleteUniversity(item._id, item.name)}
                                                    title="Delete Record"
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

export default UniversityAdmin;
