import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function UniversityAdmin() {
    const [universityId, setUniversityId] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [form, setForm] = useState({ name: "", location: "", foundedYear: "", website: "", ranking: "", image: null });
    const [formError, setFormError] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getUniversities();
    }, []);

    const getUniversities = async () => {
        try {
            const { data } = await axios.get("http://localhost:8081/university");
            setUniversities(data.univData || []);
        } catch (error) {
            Swal.fire("Error", "Unable to fetch universities", "error");
        }
    };

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setForm({ ...form, image: e.target.files[0] });
        }
    };

    const validateForm = () => {
        let errors = {};
        if (!form.name.trim()) errors.name = "University name is required.";
        if (!form.location.trim()) errors.location = "Location is required.";
        if (!form.foundedYear.trim()) errors.foundedYear = "Valid year required.";
        if (!/^https?:\/\/.+/.test(form.website)) errors.website = "Valid URL required.";
        if (!form.ranking.trim()) errors.ranking = "Valid ranking required.";
        if (!form.image && !universityId) errors.image = "Image is required.";

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
                ? await axios.put("http://localhost:8081/university", formData, { headers: { "Content-Type": "multipart/form-data" } })
                : await axios.post("http://localhost:8081/university", formData, { headers: { "Content-Type": "multipart/form-data" } });

            Swal.fire("Success", response.data.message, "success");
            getUniversities();
            resetForm();
        } catch (error) {
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    const resetForm = () => {
        setUniversityId(null);
        setForm({ name: "", location: "", foundedYear: "", website: "", ranking: "", image: null });
        setFormError({});
    };

    const deleteUniversity = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await axios.delete("http://localhost:8081/university", { data: { id } });
                    Swal.fire("Deleted!", data.message, "success");
                    getUniversities();
                } catch (error) {
                    Swal.fire("Error", "Something went wrong while deleting", "error");
                }
            }
        });
    };

    return (
        <div className='container mt-4'>
            <div className='card shadow-lg'>
                <div className='card-header bg-success text-white text-center fw-bold'>{universityId ? "Edit University" : "New University"}</div>
                <div className='card-body'>
                    {Object.keys(form).map((key) => (
                        key !== "image" ? (
                            <div className='row mb-3' key={key}>
                                <label className='col-sm-3 col-form-label'>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                <div className='col-sm-9'>
                                    <input type={key === "foundedYear" || key === "ranking" ? "number" : "text"} className='form-control' name={key} onChange={changeHandler} value={form[key]} />
                                    {formError[key] && <small className='text-danger'>{formError[key]}</small>}
                                </div>
                            </div>
                        ) : (
                            <div className='row mb-3' key={key}>
                                <label className='col-sm-3 col-form-label'>Image</label>
                                <div className='col-sm-9'>
                                    <input type='file' className='form-control' name='image' onChange={handleFileChange} />
                                    {formError.image && <small className='text-danger'>{formError.image}</small>}
                                </div>
                            </div>
                        )
                    ))}
                    <div className='text-center'>
                        <button className='btn btn-success' onClick={handleSubmit}>{universityId ? "Update" : "Save"}</button>
                    </div>
                </div>
            </div>

            <table className='table table-striped table-bordered mt-4'>
                <thead className='table-dark'>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Founded</th>
                        <th>Website</th>
                        <th>Ranking</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {universities.map((item) => (
                        <tr key={item._id} className="align-middle">
                            {/* University Image */}
                            <td>
                                <img
                                    src={`http://localhost:8081/${item.image}`}
                                    className="img-thumbnail rounded-circle border shadow-sm"
                                    width="80"
                                    height="80"
                                    alt="University"
                                />
                            </td>

                            {/* University Details */}
                            <td className="fw-semibold">{item.name}</td>
                            <td>{item.location}</td>
                            <td>{item.foundedYear}</td>
                            <td>
                                <a href={item.website} target="_blank" rel="noopener noreferrer" className="btn btn-link text-decoration-none fw-bold">
                                    Visit 🔗
                                </a>
                            </td>
                            <td className="fw-bold text-primary">{item.ranking}</td>

                            {/* Add Department Button */}
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-success fw-bold px-3 py-1 d-flex align-items-center gap-1 rounded-pill shadow-sm"
                                    onClick={() => navigate(`/departmentAdmin?id=${item._id}&name=${encodeURIComponent(item.name)}`)}
                                >
                                    <i className="bi bi-plus-lg"></i> Add Dept
                                </button>
                            </td>


                            {/* Edit & Delete Buttons */}
                            <td className="text-center py-2">
                                <div className="d-flex justify-content-center align-items-center gap-2">
                                    {/* Edit Button */}
                                    <button
                                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 rounded-pill shadow-sm px-3"
                                        onClick={() => setUniversityId(item._id)}
                                    >
                                        <i className="bi bi-pencil"></i> Edit
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 rounded-pill shadow-sm px-3"
                                        onClick={() => deleteUniversity(item._id)}
                                    >
                                        <i className="bi bi-trash"></i> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
}

export default UniversityAdmin;
