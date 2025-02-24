import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

function CourseAdmin() {
  const query = useQuery();
  const [courses, setCourses] = useState(null)
  const [courseId, setCourseId] = useState(null)
  const [form, setForm] = useState({ name: "", code: "", price: "", description: "", duration: "", image: null, department: query.get("id") })
  const [formError, setFormError] = useState({ name: "", code: "", price: "", description: "", duration: "", image: "" })

  const changeHandler = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value
    }));
  }

  function getCoursesByDepartmentId() {
    try {
      axios.get("https://campusconnect-1od1.onrender.com/courses?departmentId=" + query.get("id")).then((c) => {
        setCourses(c.data.crsData)
      })
    } catch (err) {
      Swal.fire("Error", "Unable to Fetch Data From API", "error")
    }
  }

  useEffect(() => {
    getCoursesByDepartmentId()
  }, [])


  function saveCourses() {
    try {
      let formData = new FormData()
      formData.append("name", form.name);
      formData.append("code", form.code);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("duration", form.duration);
      formData.append("image", form.image, form.image.name);
      formData.append("departmentId", query.get("id"));
      axios.post("https://campusconnect-1od1.onrender.com/courses", formData, {
        "content-type": "multipart/form-data",
      }).then((c) => {
        Swal.fire("Success", c.data.message, "success");
        getCoursesByDepartmentId()
        resetForm()
      })
    } catch (err) {
      Swal.fire("Error", "Unable to Fetch Data From API", "error");
    }
  }


  function resetForm() {
    setForm({ name: "", code: "", price: "", description: "", duration: "", image: null })
  }

  function updateCourses() {
    try {
      let formData = new FormData()
      formData.append("name", form.name);
      formData.append("code", form.code);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("duration", form.duration);
      formData.append("image", form.image, form.image.name);
      formData.append("departmentId", query.get("id"));
      formData.append("id", courseId);
      Swal.fire({
        title: "Update Course?",
        text: "Are you sure you want to update this course?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Update!",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.put("https://campusconnect-1od1.onrender.com/courses", formData, {
            "content-type": "multipart/form-data",
          }).then((c) => {
            Swal.fire("Success", c.data.message, "success");
            getCoursesByDepartmentId()
            resetForm()
          })
        }
      })
    } catch (err) {
      Swal.fire("Error", "Unable to Fetch Data From API", "error");
    }
  }

  function deleteCourses(id) {
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
          axios.delete("https://campusconnect-1od1.onrender.com/courses", { data: { id: id } }).then((c) => {
            Swal.fire("Success", c.data.message, "success");
            getCoursesByDepartmentId()
            resetForm()
          })
        }
      })
    } catch (err) {
      Swal.fire("Error", "Unable to Fetch Data From API", "error");
    }
  }

  function onCourseSubmit() {
    let hasError = false;
    let error = { name: "", code: "", price: "", description: "", duration: "", image: "" };

    if (!form.name.trim()) {
      hasError = true;
      error.name = "Course name is required.";
    }

    if (!form.code.trim()) {
      hasError = true;
      error.code = "Course code is required.";
    }

    if (!form.price || isNaN(form.price) || form.price < 0) {
      hasError = true;
      error.price = "Price must be a valid number and cannot be negative.";
    }

    if (!form.description.trim()) {
      hasError = true;
      error.description = "Course description is required.";
    }

    if (!form.duration || !form.duration.toString().trim()) {
      hasError = true;
      error.duration = "Course duration is required.";
    }

    if (!form.image) {
      hasError = true;
      error.image = "Image is required.";
    }

    setFormError(error);

    if (hasError) {
      Swal.fire("Validation Error", "Please fill all fields correctly", "warning");
    } else {
      courseId ? updateCourses() : saveCourses();
    }
  }



  function renderCourses() {
    return courses?.map((item) => (
      <tr className="text-center align-middle">
        <td>
          <img src={`https://campusconnect-1od1.onrender.com/` + item.image} className="img-thumbnail" width="100" height="100" alt="Course" />
        </td>
        <td>{item.name}</td>
        <td>{item.code}</td>
        <td>${item.price}</td>
        <td className='text-truncate' style={{ maxWidth: "150px" }}>{item.description}</td>
        <td>{item.duration} weeks</td>
        <td>
          <button className='btn btn-sm btn-primary fw-bold' onClick={() => {
            setCourseId(item._id);
            setForm({ ...form, name: item.name, code: item.code, maxStudents: item.maxStudents, price: item.price, description: item.description, duration: item.duration });
          }}>Edit</button>
        </td>
        <td>
          <button className='btn btn-sm btn-danger fw-bold' onClick={() => deleteCourses(item._id)}>Delete</button>
        </td>
      </tr>
    ));
  }

  return (
    <div className="container mt-4">
      <div className="card mx-auto shadow-lg rounded-3 bg-light" style={{ maxWidth: "500px" }}>
        <div className="card-header fw-bold bg-success text-white text-center">
          {courseId ? "Edit Course" : "New Course"}
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Department Name</label>
            <input className="form-control" name='name' value={query.get("name")} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Course Name</label>
            <input className="form-control" type='text' value={form.name} placeholder='Course Name' onChange={changeHandler} name='name' />
            <p className="text-danger">{formError.name}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea className="form-control" value={form.description} placeholder="Enter a description..." onChange={changeHandler} name="description" rows="3"></textarea>
            <p className="text-danger">{formError.description}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Code</label>
            <input className="form-control" type='text' value={form.code} placeholder='Course Code' onChange={changeHandler} name='code' />
            <p className="text-danger">{formError.code}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Price</label>
            <input className="form-control" type='number' min="0" value={form.price} placeholder='Course Price' onChange={changeHandler} name='price' />
            <p className="text-danger">{formError.price}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Duration (Weeks)</label>
            <input className="form-control" type='number' min="0" value={form.duration} placeholder='Course Duration' onChange={changeHandler} name='duration' />
            <p className="text-danger">{formError.duration}</p>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Course Image</label>
            <input className="form-control" type='file' name='image' onChange={(e) => {
              let file = e.target.files[0];
              setForm((prevForm) => ({ ...prevForm, image: file }));
            }} />
            <p className="text-danger">{formError.image}</p>
          </div>
        </div>
        <div className="card-footer text-center">
          <button className="btn btn-success fw-bold px-4" onClick={() => { onCourseSubmit() }}>
            {courseId ? "Update" : "Save"}
          </button>
        </div>
      </div>
      <div className="mt-4 border p-3 rounded shadow-sm bg-white">
        <h4 className="text-center mb-3">Course List</h4>
        <table className="table table-bordered table-hover table-striped">
          <thead className="table-dark text-center">
            <tr>
              <th>Course Image</th>
              <th>Course Name</th>
              <th>Code</th>
              <th>Price</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>{renderCourses()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseAdmin;
