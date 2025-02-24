import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserDepartment() {
  const query = useQuery();
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getDepartmentsByUniversityId();
  }, []);

  function getDepartmentsByUniversityId() {
    axios
      .get("http://localhost:8081/department?universityId=" + query.get("id"))
      .then((response) => {
        setDepartments(response.data.depData);
        setFilteredDepartments(response.data.depData);
      })
      .catch(() => {
        console.log(err.message);

      });
  }

  useEffect(() => {
    const filtered = departments.filter((dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDepartments(filtered);
  }, [search, departments]);

  const columns = [
    {
      name: "Image",
      selector: (row) => (
        <img
          src={`http://localhost:8081/${row.image}`}
          alt={row.name}
          style={{ width: "120px", height: "90px", objectFit: "cover" }}
        />
      ),
      sortable: false,
    },
    { name: "Department Name", selector: (row) => row.name, sortable: true },
    { name: "Phone Number", selector: (row) => `${row.phoneNumber}`, sortable: true },
    { name: "Faculty Count", selector: (row) => `${row.facultyCount}+`, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/userCourse?id=${row._id}&name=${encodeURIComponent(row.name)}`)}
        >
          View Courses
        </button>
      ),
    },
  ];

  return (
    <div className="container mt-3">
      <h3>Departments</h3>
      <input
        type="text"
        placeholder="Search Department..."
        className="form-control mb-3"
        onChange={(e) => setSearch(e.target.value)}
      />
      <DataTable
        columns={columns}
        data={filteredDepartments}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}

export default UserDepartment;
