import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

function DepartmentAdmin() {
  const query = useQuery();
  const navigate = useNavigate();
  const [departmentId, setDepartmentId] = useState(null)
  const [departments, setDepartments] = useState(null)
  const [form, setForm] = useState({ name: "", phoneNumber: "", facultyCount: "", image: null, university: query.get("id") })
  const [formError, setFormError] = useState({ name: "", phoneNumber: "", facultyCount: "", image: "" })

  const changeHandler = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value
    }));
  }

  function getDepartmentByUniversityId() {
    try {
      axios.get("https://campusconnect-1od1.onrender.com/department?universityId=" + query.get("id")).then((d) => {
        setDepartments(d.data.depData)
      })
    } catch (err) {
      Swal.fire("Error", "Unable to Fetch Data From API", "error")
    }
  }

  useEffect(() => {
    getDepartmentByUniversityId()
  }, [])

  function saveDepartment() {
    try {
      let formData = new FormData()
      formData.append("name", form.name)
      formData.append("phoneNumber", form.phoneNumber)
      formData.append("facultyCount", form.facultyCount)
      formData.append("image", form.image, form.image.name)
      formData.append("universityId", query.get("id"))
      axios.post("https://campusconnect-1od1.onrender.com/department", formData, {
        "content-type": "multipart/form-data",
      }).then((d) => {
        Swal.fire("Success", d.data.message, "success");
        getDepartmentByUniversityId()
        resetForm()
      })
    } catch (err) {
      Swal.fire("Error", "Unable to Fetch Data From API", "error");
    }
  }

  function resetForm() {
    setForm({ name: "", phoneNumber: "", facultyCount: "", image: null, })
    setDepartmentId(null);
  }

  function updateDepartment() {
    try {
      let formData = new FormData()
      formData.append("name", form.name)
      formData.append("phoneNumber", form.phoneNumber)
      formData.append("facultyCount", form.facultyCount)
      formData.append("image", form.image, form.image.name)
      formData.append("universityId", query.get("id"))
      formData.append("id", departmentId)
      Swal.fire({
        title: "Update Department?",
        text: "Are you sure you want to update this department?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Update!",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.put("https://campusconnect-1od1.onrender.com/department", formData, {
            "content-type": "multipart/form-data",
          }).then((d) => {
            Swal.fire("Success", d.data.message, "success");
            getDepartmentByUniversityId()
            resetForm()
          }).catch(() => {
            Swal.fire("Error", "Something went wrong while updating", "error")
          });
        }
      })
    } catch (err) {
      Swal.fire("Error", "Unable to Fetch Data From API", "error");
    }
  }

  function deleteDepartment(id) {
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
          axios.delete("https://campusconnect-1od1.onrender.com/department", { data: { id: id } }).then((d) => {
            Swal.fire("Success", d.data.message, "success");
            getDepartmentByUniversityId()
            resetForm()
          })
        }
      })
    } catch (err) {
      Swal.fire("Error", "Unable to Fetch Data From API", "error");
    }
  }

  function onDepartmentSubmit() {
    let errors = false;
    let error = { name: "", phoneNumber: "", facultyCount: "", image: "" }

    if (!form.name.trim()) {
      errors = true;
      error.name = "Department name is required.";
    }

    if (!String(form.phoneNumber).trim()) {
      errors = true;
      error.phoneNumber = "Phone number is required.";
    }


    if (!form.facultyCount || isNaN(Number(form.facultyCount)) || Number(form.facultyCount) <= 0) {
      errors = true;
      error.facultyCount = "Faculty count must be a valid positive number.";
    }

    if (!form.image) {
      errors = true;
      error.image = "Image is required.";
    }

    setFormError(error);

    if (errors) {
      Swal.fire("Validation Error", "Please fill all fields correctly", "warning");
    } else {
      departmentId ? updateDepartment() : saveDepartment();
    }
  }

  function randerDepartments() {
    return departments?.map((item) => {
      return (
        <tr key={item._id} className="text-center align-middle">
          <td>
            <img src={`https://campusconnect-1od1.onrender.com/` + item.image} className="img-thumbnail" alt="Department" width="100" height="100" />
          </td>
          <td>{item.name}</td>
          <td>{item.phoneNumber}</td>
          <td>{item.facultyCount}</td>
          <td>
            <button className='btn btn-sm btn-secondary fw-bold' onClick={() => {
              navigate(`/courseAdmin?id=${item._id}&name=${encodeURIComponent(item.name)}`);
            }}>Add Course</button>
          </td>
          <td>
            <button className='btn btn-sm btn-primary fw-bold' onClick={() => {
              setDepartmentId(item._id);
              setForm({ ...form, name: item.name, phoneNumber: item.phoneNumber, facultyCount: item.facultyCount });
            }}>Edit</button>
          </td>
          <td>
            <button className='btn btn-sm btn-danger fw-bold' onClick={() => deleteDepartment(item._id)}>Delete</button>
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="container mt-4">
      <div className="card mx-auto shadow-lg rounded-3 bg-light" style={{ maxWidth: "500px" }}>
        <div className="card-header fw-bold bg-success text-white text-center">
          {departmentId ? "Edit Department" : "New Department"}
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">University Name</label>
            <input className="form-control" name='name' value={query.get("name")} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Department Name</label>
            <input className="form-control" type='text' value={form.name} placeholder='Department Name' onChange={changeHandler} name='name' />
            <p className="text-danger">{formError.name}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Phone Number</label>
            <input className="form-control" type='number' min="0" value={form.phoneNumber} placeholder='Phone Number' onChange={changeHandler} name='phoneNumber' />
            <p className="text-danger">{formError.phoneNumber}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Faculty Count</label>
            <input className="form-control" type='number' min="0" value={form.facultyCount} placeholder='Faculty Count' onChange={changeHandler} name='facultyCount' />
            <p className="text-danger">{formError.facultyCount}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Department Image</label>
            <input className="form-control" type='file' name='image' onChange={(e) => {
              let file = e.target.files[0];
              setForm((prevForm) => ({ ...prevForm, image: file }));
            }} />
            <p className="text-danger">{formError.image}</p>
          </div>
        </div>
        <div className="card-footer text-center">
          <button className="btn btn-success fw-bold px-4" onClick={onDepartmentSubmit}>
            {departmentId ? "Update" : "Save"}
          </button>
        </div>
      </div>

      <div className="mt-4 border p-3 rounded shadow-sm bg-white">
        <h4 className="text-center mb-3">Department List</h4>
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark text-center">
            <tr>
              <th>Department Image</th>
              <th>Department Name</th>
              <th>Phone Number</th>
              <th>Faculty Count</th>
              <th>Add Course</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{randerDepartments()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default DepartmentAdmin;
