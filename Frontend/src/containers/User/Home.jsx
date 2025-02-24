import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';

function Home() {
  const [universities, setUniversities] = useState([]);
  const [search, setSearch] = useState(""); // State for search input
  const [filteredUniversities, setFilteredUniversities] = useState([]); // Filtered data
  const navigate = useNavigate();

  useEffect(() => {
    getAllUniversities();
  }, []);

  function getAllUniversities() {
    axios.get("http://localhost:8081/university")
      .then((response) => {
        setUniversities(response.data.univData);
        setFilteredUniversities(response.data.univData);
      })
      .catch((err) => console.log(err.message));
  }

  // Handle search filtering
  useEffect(() => {
    const filteredData = universities.filter((univ) =>
      univ.name.toLowerCase().includes(search.toLowerCase()) ||
      univ.location.toLowerCase().includes(search.toLowerCase()) ||
      String(univ.foundedYear).includes(search) ||
      String(univ.ranking).includes(search) ||
      (univ.website && univ.website.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredUniversities(filteredData);
  }, [search, universities]);

  const columns = [
    {
      name: 'Image',
      selector: row => <img src={`http://localhost:8081/${row.image}`} alt="University" width="100" height="100" style={{ objectFit: "cover" }} />,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Country',
      selector: row => row.location,
      sortable: true
    },
    {
      name: 'Established Year',
      selector: row => row.foundedYear,
      sortable: true
    },
    {
      name: 'Ranking',
      selector: row => row.ranking,
      sortable: true
    },
    {
      name: 'Website',
      selector: row => row.website ? <a href={row.website} target="_blank" rel="noopener noreferrer">Visit Website</a> : 'N/A',
    },
    {
      name: 'Actions',
      cell: row => (
        <button className='btn btn-primary' onClick={() => navigate(`/userDepartment?id=${row._id}&name=${encodeURIComponent(row.name)}`)}>
          View Department
        </button>
      )
    }
  ];

  return (
    <div className='container mt-5'>
      <h2 className='text-center mb-4 text-info'>University List</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search university by name, country, year, ranking, website..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* DataTable */}
      <DataTable
        title="Universities"
        columns={columns}
        data={filteredUniversities} // Use filtered data
        pagination
        highlightOnHover
        responsive
        customStyles={{
          headCells: {
            style: {
              backgroundColor: '#f7f7f7',
              fontWeight: 'bold',
              fontSize: '16px',
              color: '#333',
            },
          },
          cells: {
            style: {
              fontSize: '14px',
              color: '#555',
            },
          },
        }}
      />
    </div>
  );
}

export default Home;
