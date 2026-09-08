import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://campusconnect-1od1.onrender.com/register");
      const list = response.data.users || [];
      setUsers(list);
      setFilteredUsers(list);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch users", error);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      const q = search.toLowerCase();
      setFilteredUsers(
        users.filter(u => 
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)) ||
          (u.role && u.role.toLowerCase().includes(q))
        )
      );
    }
  }, [search, users]);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ id: null, name: "", email: "", role: "user", password: "" });
    setShowForm(false);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      Swal.fire("Validation Error", "Name and email are required.", "warning");
      return;
    }

    try {
      if (form.id) {
        // Edit flow
        await axios.put(`https://campusconnect-1od1.onrender.com/users/${form.id}`, form);
        Swal.fire("Success", "User account updated successfully!", "success");
      } else {
        // Add flow
        await axios.post("https://campusconnect-1od1.onrender.com/register", form);
        Swal.fire("Success", "New user account created successfully!", "success");
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to process user request", "error");
    }
  };

  const startEdit = (user) => {
    setForm({
      id: user._id,
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      password: "",
    });
    setShowForm(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const deleteUser = async (id, name) => {
    Swal.fire({
      title: `Delete ${name || "User"}?`,
      text: "This user account and permissions will be permanently revoked!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete Account",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://campusconnect-1od1.onrender.com/users/${id}`);
          Swal.fire("Deleted!", "User has been removed from directory.", "success");
          fetchUsers();
        } catch (error) {
          Swal.fire("Error", "Failed to delete user account", "error");
        }
      }
    });
  };

  const adminCount = users.filter(u => u.role === "admin").length;
  const userCount = users.filter(u => u.role !== "admin").length;

  return (
    <div className="container py-4">
      {/* Admin Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="badge-soft-primary mb-1">
            <i className="bi bi-people-fill"></i> User Directory & Access
          </span>
          <h2 className="fw-bold text-dark mb-0">User Management</h2>
        </div>
        <button 
          className={`btn ${showForm ? 'btn-outline-secondary' : 'btn-premium-primary'} d-flex align-items-center gap-2`}
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
        >
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-person-plus-fill'}`}></i>
          {showForm ? "Close Form" : "Add User Account"}
        </button>
      </div>

      {/* Stats Bar */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-box d-flex align-items-center justify-content-between p-3">
            <div className="text-start">
              <div className="stat-number fs-3">{users.length}</div>
              <div className="stat-label mt-0">Total Enrolled Accounts</div>
            </div>
            <i className="bi bi-people fs-1 text-primary opacity-25"></i>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-box d-flex align-items-center justify-content-between p-3">
            <div className="text-start">
              <div className="stat-number fs-3 text-warning">{adminCount}</div>
              <div className="stat-label mt-0">System Administrators</div>
            </div>
            <i className="bi bi-shield-check fs-1 text-warning opacity-25"></i>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-box d-flex align-items-center justify-content-between p-3">
            <div className="text-start">
              <div className="stat-number fs-3 text-info">{userCount}</div>
              <div className="stat-label mt-0">Student Users</div>
            </div>
            <i className="bi bi-mortarboard fs-1 text-info opacity-25"></i>
          </div>
        </div>
      </div>

      {/* Expandable Add/Edit User Form */}
      {showForm && (
        <div className="glass-card p-4 mb-4 shadow-lg animate-fade-in border-primary border-opacity-25">
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h5 className="fw-bold text-dark mb-0">
              {form.id ? "Edit User Account & Role" : "Create New User Account"}
            </h5>
            <button type="button" className="btn-close" onClick={resetForm}></button>
          </div>

          <form onSubmit={handleSaveUser}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">User Full Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Email Address</label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={changeHandler}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Assigned Role</label>
                <select
                  className="form-select"
                  name="role"
                  value={form.role}
                  onChange={changeHandler}
                >
                  <option value="user">User (Student / General)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">
                  {form.id ? "New Password (leave blank to keep current)" : "Password"}
                </label>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder={form.id ? "••••••••" : "Minimum 6 characters"}
                  value={form.password}
                  onChange={changeHandler}
                  required={!form.id}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <button type="button" className="btn btn-light border px-4" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn-premium-primary px-4">
                {form.id ? "Update Account" : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table Card */}
      <div className="glass-card p-3 p-md-4 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div className="input-icon-wrapper flex-grow-1" style={{ maxWidth: "360px" }}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search user name, email, role..."
              className="form-control form-control-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-muted small">
            Showing {filteredUsers.length} accounts
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Loading accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: "36px",
                            height: "36px",
                            backgroundColor: user.role === "admin" ? "#f59e0b" : "#4f46e5",
                            fontSize: "0.85rem"
                          }}
                        >
                          {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                        </div>
                        <span className="fw-bold text-dark">{user.name || "Unnamed User"}</span>
                      </div>
                    </td>
                    <td className="text-muted small">{user.email}</td>
                    <td>
                      {user.role === "admin" ? (
                        <span className="badge-soft-warning fw-bold">
                          <i className="bi bi-shield-check me-1"></i> Admin
                        </span>
                      ) : (
                        <span className="badge-soft-cyan fw-bold">
                          <i className="bi bi-person me-1"></i> Student
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          className="btn btn-sm btn-light border text-primary"
                          onClick={() => startEdit(user)}
                          title="Edit User"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-light border text-danger"
                          onClick={() => deleteUser(user._id, user.name)}
                          title="Delete User"
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

export default UserAdmin;
