import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import DataTable from 'react-data-table-component';

function Home() {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUniversities();
  }, []);

  function getAllUniversities() {
    setLoading(true);
    axios.get("https://campusconnect-1od1.onrender.com/university")
      .then((response) => {
        const data = response.data.univData || [];
        setUniversities(data);
        setFilteredUniversities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching universities:", err.message);
        setLoading(false);
      });
  }

  // Handle search and category filtering
  useEffect(() => {
    let result = universities;

    // Apply quick chip filter
    if (activeFilter === "top10") {
      result = result.filter(u => Number(u.ranking) <= 10 && Number(u.ranking) > 0);
    } else if (activeFilter !== "all") {
      result = result.filter(u => u.location && u.location.toLowerCase().includes(activeFilter.toLowerCase()));
    }

    // Apply text search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((univ) =>
        (univ.name && univ.name.toLowerCase().includes(q)) ||
        (univ.location && univ.location.toLowerCase().includes(q)) ||
        String(univ.foundedYear).includes(q) ||
        String(univ.ranking).includes(q) ||
        (univ.website && univ.website.toLowerCase().includes(q))
      );
    }

    setFilteredUniversities(result);
  }, [search, activeFilter, universities]);

  // Fallback placeholder image for university
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://campusconnect-1od1.onrender.com/${imagePath}`;
  };

  const columns = [
    {
      name: 'Campus',
      selector: row => (
        <img 
          src={getImageUrl(row.image)} 
          alt={row.name} 
          width="70" 
          height="55" 
          className="rounded-3 shadow-sm my-2" 
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80";
          }}
        />
      ),
      width: '100px'
    },
    {
      name: 'University Name',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <div>
          <div className="fw-bold text-dark">{row.name}</div>
          <small className="text-muted d-flex align-items-center gap-1">
            <i className="bi bi-geo-alt-fill text-danger small"></i> {row.location || "Global"}
          </small>
        </div>
      ),
      grow: 2
    },
    {
      name: 'Location',
      selector: row => row.location,
      sortable: true,
    },
    {
      name: 'Established',
      selector: row => row.foundedYear,
      sortable: true,
      cell: row => (
        <span className="badge-soft-primary">
          <i className="bi bi-calendar3 small"></i> {row.foundedYear || "N/A"}
        </span>
      )
    },
    {
      name: 'Global Ranking',
      selector: row => Number(row.ranking) || 999,
      sortable: true,
      cell: row => (
        <span className="badge-soft-warning fw-bold">
          <i className="bi bi-trophy-fill small"></i> Rank #{row.ranking || "N/A"}
        </span>
      )
    },
    {
      name: 'Official Portal',
      cell: row => (
        row.website ? (
          <a 
            href={row.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 py-1 px-2"
          >
            Visit <i className="bi bi-box-arrow-up-right small"></i>
          </a>
        ) : <span className="text-muted small">N/A</span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <button 
          className="btn-premium-primary btn-sm py-1 px-3"
          onClick={() => navigate(`/userDepartment?id=${row._id}&name=${encodeURIComponent(row.name)}`)}
        >
          Departments <i className="bi bi-arrow-right-short"></i>
        </button>
      ),
      right: true
    }
  ];

  return (
    <div className="container py-5">
      {/* Header Banner */}
      <div className="text-center mb-5">
        <span className="section-badge">
          <i className="bi bi-mortarboard-fill"></i> Directory Explorer
        </span>
        <h1 className="section-title">Discover Top Universities</h1>
        <p className="section-subtitle">
          Browse world-renowned institutions, compare global rankings, and explore individual departments & faculties.
        </p>
      </div>

      {/* Control Bar: Search, Filters & View Toggle */}
      <div className="glass-card p-3 p-md-4 mb-4">
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-lg-5 col-md-6">
            <div className="input-icon-wrapper">
              <i className="bi bi-search"></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search by university, country, ranking, or year..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  className="btn btn-sm position-absolute end-0 top-50 translate-middle-y text-muted me-2"
                  onClick={() => setSearch("")}
                  type="button"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="col-lg-5 col-md-6 d-flex flex-wrap gap-1 align-items-center">
            <button 
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeFilter === 'all' ? 'btn-primary' : 'btn-light border'}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button 
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeFilter === 'top10' ? 'btn-primary' : 'btn-light border'}`}
              onClick={() => setActiveFilter('top10')}
            >
              🏆 Top 10
            </button>
            <button 
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeFilter === 'usa' ? 'btn-primary' : 'btn-light border'}`}
              onClick={() => setActiveFilter('usa')}
            >
              🇺🇸 USA
            </button>
            <button 
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeFilter === 'uk' ? 'btn-primary' : 'btn-light border'}`}
              onClick={() => setActiveFilter('uk')}
            >
              🇬🇧 UK
            </button>
            <button 
              className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeFilter === 'india' ? 'btn-primary' : 'btn-light border'}`}
              onClick={() => setActiveFilter('india')}
            >
              🇮🇳 India
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="col-lg-2 col-md-12 d-flex justify-content-md-end justify-content-start">
            <div className="d-inline-flex shadow-sm rounded-3 overflow-hidden">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <i className="bi bi-grid-fill"></i> Grid
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <i className="bi bi-list-ul"></i> Table
              </button>
            </div>
          </div>
        </div>

        {/* Results Count Bar */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light small text-muted">
          <span>
            Showing <strong className="text-dark">{filteredUniversities.length}</strong> of <strong className="text-dark">{universities.length}</strong> universities
          </span>
          {search && (
            <span>
              Filtered by: "<span className="text-primary fw-medium">{search}</span>"
            </span>
          )}
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status"></div>
          <p className="text-muted fw-medium">Loading universities directory...</p>
        </div>
      ) : filteredUniversities.length === 0 ? (
        /* Empty State */
        <div className="glass-card text-center p-5 my-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-muted mb-3"
            style={{ width: "72px", height: "72px", fontSize: "2rem" }}
          >
            <i className="bi bi-search"></i>
          </div>
          <h4 className="fw-bold text-dark">No Universities Found</h4>
          <p className="text-muted mx-auto" style={{ maxWidth: "450px" }}>
            We couldn't find any institutions matching your search criteria. Try modifying your keywords or clear your active filters.
          </p>
          <button 
            className="btn btn-outline-primary rounded-pill px-4 mt-2 fw-semibold"
            onClick={() => { setSearch(""); setActiveFilter("all"); }}
          >
            Clear Filters & Show All
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="row g-4 animate-fade-in">
          {filteredUniversities.map((item) => (
            <div key={item._id} className="col-lg-4 col-md-6">
              <div className="university-card">
                {/* Image Banner */}
                <div className="university-card-img-wrapper">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="university-card-img"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  {/* Ranking Tag */}
                  {item.ranking && (
                    <div 
                      className="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 text-white px-2.5 py-1.5 rounded-pill shadow-sm small fw-semibold"
                      style={{ backdropFilter: "blur(4px)" }}
                    >
                      <i className="bi bi-trophy-fill text-warning me-1"></i>
                      Rank #{item.ranking}
                    </div>
                  )}
                  {/* Established Year Tag */}
                  {item.foundedYear && (
                    <div 
                      className="position-absolute bottom-0 end-0 m-3 badge bg-white text-dark px-2.5 py-1 rounded-pill shadow-sm small fw-semibold"
                      style={{ fontSize: "0.78rem" }}
                    >
                      Est. {item.foundedYear}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <div className="d-flex align-items-center gap-1 text-muted small mb-2">
                    <i className="bi bi-geo-alt-fill text-danger"></i>
                    <span>{item.location || "Location not specified"}</span>
                  </div>

                  <h5 className="fw-bold text-dark mb-2" style={{ lineHeight: "1.3" }}>
                    {item.name}
                  </h5>

                  <p className="text-secondary small mb-4 flex-grow-1" style={{ lineHeight: "1.6" }}>
                    Explore academic faculties, accredited degrees, and departmental resources available at this campus.
                  </p>

                  {/* Actions Bar */}
                  <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light mt-auto">
                    {item.website ? (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1"
                      >
                        Website <i className="bi bi-box-arrow-up-right small"></i>
                      </a>
                    ) : (
                      <span className="text-muted small">Website N/A</span>
                    )}

                    <button
                      className="btn-premium-primary btn-sm py-1.5 px-3 rounded-pill"
                      onClick={() => navigate(`/userDepartment?id=${item._id}&name=${encodeURIComponent(item.name)}`)}
                    >
                      Departments <i className="bi bi-arrow-right-short"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card p-2 p-md-3 animate-fade-in shadow-sm">
          <DataTable
            columns={columns}
            data={filteredUniversities}
            pagination
            highlightOnHover
            responsive
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: '#f8fafc',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  color: '#1e293b',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                },
              },
              cells: {
                style: {
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  fontSize: '0.9rem',
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
