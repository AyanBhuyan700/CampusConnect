import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function UserCourse() {
    const query = useQuery();
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getCourseByDepartmentId();
    }, []);

    function getCourseByDepartmentId() {
        try {
            axios
                .get("https://campusconnect-1od1.onrender.com/courses?departmentId=" + query.get("id"))
                .then((response) => {
                    setCourses(response.data.crsData);
                    setFilteredCourses(response.data.crsData);
                })
                .catch((err) => {
                    console.log(err.message);

                });
        } catch (err) {
            console.log(err.message);

        }

    }

    useEffect(() => {
        const filtered = courses.filter((course) =>
            course.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCourses(filtered);
    }, [search, courses]);

    const columns = [
        {
            name: "Image",
            selector: (row) => (
                <img
                    src={`https://campusconnect-1od1.onrender.com/${row.image}`}
                    alt={row.name}
                    style={{ width: "80px", height: "50px", objectFit: "cover" }}
                />
            ),
            sortable: false,
        },
        { name: "Course Name", selector: (row) => row.name, sortable: true },
        { name: "Course Code", selector: (row) => row.code, sortable: true },
        { name: "Duration (Weeks)", selector: (row) => `${row.duration} Weeks`, sortable: true },
        { name: "Price ($)", selector: (row) => `${row.price} $`, sortable: true },
        { name: "Description", selector: (row) => row.description, sortable: false },
    ];

    return (
        <div className="container mt-3">
            <h3>Courses</h3>
            <input
                type="text"
                placeholder="Search Course..."
                className="form-control mb-3"
                onChange={(e) => setSearch(e.target.value)}
            />
            <DataTable
                columns={columns}
                data={filteredCourses}
                pagination
                highlightOnHover
                striped
            />
        </div>
    );
}

export default UserCourse;
