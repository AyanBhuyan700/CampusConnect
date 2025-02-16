import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function UniversityAdmin() {
    const [universityId, setUniversityId] = useState(null);
    const [universities, setUniversities] = useState(null);
    const [form, setForm] = useState({ name: "", location: "", foundedYear: "", website: "", ranking: "", image: null });
    const [formError, setFormError] = useState({ name: "", location: "", foundedYear: "", website: "", ranking: "", image: "" });
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setForm(prevForm => ({ ...prevForm, [e.target.name]: e.target.value }));
    };

    function getUniversities() {
        try {
            axios.get("http://localhost:8081/university").then((d) => {
                setUniversities(d.data.univData)
            }).catch(() => {
                Swal.fire("Error", "Unable to Fetch Data From API", "error")
            });
        } catch (err) {
            Swal.fire("Error", "Unable to Fetch Data From API", "error")
        }

    }

    useEffect(() => {
        getUniversities();
    }, []);

    function saveUniversity() {
        try {
            let formData = new FormData();
            formData.append("name", form.name);
            formData.append("location", form.location);
            formData.append("foundedYear", form.foundedYear);
            formData.append("website", form.website);
            formData.append("ranking", form.ranking);
            formData.append("image", form.image, form.image.name);
            axios.post("http://localhost:8081/university", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((d) => {
                    Swal.fire("Success", d.data.message, "success");
                    getUniversities();
                    resetForm();
                })
                .catch(() => {
                    Swal.fire("Error", "Something went wrong while using API", "error")
                });
        } catch (error) {
            Swal.fire("Error", "Something went wrong while using API", "error")
        }
    }

    function resetForm() {
        setForm({ name: "", location: "", foundedYear: "", website: "", ranking: "", image: null });
    }

    function updateUniversity() {
        try {
            let formData = new FormData();
            formData.append("name", form.name);
            formData.append("location", form.location);
            formData.append("foundedYear", form.foundedYear);
            formData.append("website", form.website);
            formData.append("ranking", form.ranking);
            formData.append("id", universityId)
            if (form.image) {
                formData.append("image", form.image, form.image.name);
            }
            Swal.fire({
                title: "Update University?",
                text: "Are you sure you want to update this university?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, Update!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put("http://localhost:8081/university", formData, { "content-type": "multipart/form-data" })
                        .then((d) => {
                            Swal.fire("Success", d.data.message, "success");
                            getUniversities();
                            resetForm();
                        })
                        .catch(() => Swal.fire("Error", "Something went wrong while updating", "error"));
                }
            });
        } catch (err) {
            console.log(err.message);

        }
    }

    function deleteUniversity(id) {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, Delete!",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete("http://localhost:8081/university", { data: { id: id } })
                        .then((d) => {
                            Swal.fire("Deleted!", d.data.message, "success");
                            getUniversities();
                        })
                        .catch(() => {
                            Swal.fire("Error", "Something went wrong while deleting", "error")
                        });
                }
            });
        } catch (error) {
            Swal.fire("Error", "Something went wrong while deleting", "error")
        }
    }

    function onUniversitySubmit() {
        let errors = false;
        let error = { name: "", location: "", foundedYear: "", website: "", ranking: "", image: "" };

        if (!form.name.trim()) {
            errors = true, error.name = "University name is required.";
        }

        if (!form.location.trim()) {
            errors = true, error.location = "Location is required.";
        }

        if (!form.foundedYear || isNaN(Number(form.foundedYear)) || Number(form.foundedYear) <= 0) {
            errors = true, error.foundedYear = "Valid year required.";
        }

        if (!form.website.trim() || !/^https?:\/\/.+/.test(form.website)) {
            errors = true, error.website = "Valid URL required.";
        }

        if (!form.ranking || isNaN(form.ranking) || Number(form.ranking) <= 0) {
            errors = true, error.ranking = "Valid ranking required.";
        }

        if (!form.image) {
            errors = true, error.image = "Image is required.";
        }

        setFormError(error);
        if (!errors) universityId ? updateUniversity() : saveUniversity();

    }

    function renderUniversities() {
        return universities?.map((item, index) => (
            <tr key={index}>
                <td><img src={`http://localhost:8081/${item.image}`} className="img-thumbnail" width="100" /></td>
                <td>{item.name}</td>
                <td>{item.location}</td>
                <td>{item.foundedYear}</td>
                <td><a href={item.website} target="_blank" rel="noopener noreferrer">Visit</a></td>
                <td>{item.ranking}</td>
                <td>
                    <button className='btn btn-secondary' onClick={() => navigate(`/departmentAdmin?id=${item._id}&name=${encodeURIComponent(item.name)}`)}>Add Dept</button>
                </td>
                <td>
                    <button className='btn btn-primary' onClick={() => {
                        setUniversityId(item._id);
                        setForm({
                            name: item.name,
                            location: item.location,
                            foundedYear: item.foundedYear,
                            website: item.website,
                            ranking: item.ranking,
                            image: null
                        });
                    }}>Edit</button>
                </td>
                <td>
                    <button className='btn btn-danger' onClick={() => deleteUniversity(item._id)}>Delete</button>
                </td>
            </tr>
        ));
    }


    return (
        <div className='container mt-4'>
            <div className='card shadow-lg'>
                <div className='card-header bg-success text-white text-center fw-bold'>{universityId ? "Edit University" : "New University"}</div>
                <div className='card-body'>
                    <div className='row mb-3'>
                        <label className='col-sm-3 col-form-label'>Name</label>
                        <div className='col-sm-9'><input type='text' className='form-control' name='name' onChange={changeHandler} value={form.name} /></div>
                    </div>
                    <div className='row mb-3'>
                        <label className='col-sm-3 col-form-label'>Location</label>
                        <div className='col-sm-9'><input type='text' className='form-control' name='location' onChange={changeHandler} value={form.location} /></div>
                    </div>
                    <div className='row mb-3'>
                        <label className='col-sm-3 col-form-label'>Founded Year</label>
                        <div className='col-sm-9'><input type='number' className='form-control' name='foundedYear' onChange={changeHandler} value={form.foundedYear} /></div>
                    </div>
                    <div className='row mb-3'>
                        <label className='col-sm-3 col-form-label'>Website</label>
                        <div className='col-sm-9'><input type='text' className='form-control' name='website' onChange={changeHandler} value={form.website} /></div>
                    </div>
                    <div className='row mb-3'>
                        <label className='col-sm-3 col-form-label'>Ranking</label>
                        <div className='col-sm-9'><input type='number' className='form-control' name='ranking' min="0" onChange={changeHandler} value={form.ranking} /></div>
                    </div>
                    <div className='row mb-3'>
                        <label className='col-sm-3 col-form-label'>Image</label>
                        <div className='col-sm-9'><input type='file' className='form-control' name='image' onChange={(e) => setForm({ ...form, image: e.target.files[0] })} /></div>
                    </div>
                    <div className='text-center'>
                        <button className='btn btn-success' onClick={onUniversitySubmit}>{universityId ? "Update" : "Save"}</button>
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
                        <th>Add Dept</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>{renderUniversities()}</tbody>
            </table>
        </div>
    );
}

export default UniversityAdmin;
