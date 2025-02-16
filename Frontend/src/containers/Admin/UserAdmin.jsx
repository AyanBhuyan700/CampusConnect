import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function UserAdmin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8081/register");
      setUsers(response.data.users);
    } catch (error) {
      //   Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addUser = async () => {
    try {
      await axios.post("http://localhost:8081/register", form);
      Swal.fire("Success", "User added successfully!", "success");
      fetchUsers();
      setForm({ name: "", email: "", role: "user", password: "" });
    } catch (error) {
      Swal.fire("Error", "Failed to add user", "error");
    }
  };

  const deleteUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8081/users/${id}`);
          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers();
        } catch (error) {
          Swal.fire("Error", "Failed to delete user", "error");
        }
      }
    });
  };

  return (
    <div className="container">
      <h2>User Management</h2>

      <div className="card p-3 mb-3">
        <h4>{form.id ? "Edit User" : "Add New User"}</h4>
        <input className="form-control mb-2" type="text" name="name" placeholder="Name" value={form.name} onChange={changeHandler} />
        <input className="form-control mb-2" type="email" name="email" placeholder="Email" value={form.email} onChange={changeHandler} />
        <select className="form-control mb-2" name="role" value={form.role} onChange={changeHandler}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input className="form-control mb-2" type="password" name="password" placeholder="Password" value={form.password} onChange={changeHandler} />
        <button className="btn btn-success" onClick={addUser}>
          {form.id ? "Update User" : "Add User"}
        </button>
      </div>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-primary me-2" onClick={() => navigate(`/edit-user?id=${user._id}`)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => deleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserAdmin;
