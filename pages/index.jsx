import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function Dashboard() {
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [minYield, setMinYield] = useState(0);
  const [maxYield, setMaxYield] = useState(100);
  const [sortBy, setSortBy] = useState('yield'); // 'yield' or 'harvest'
  const [currentPage, setCurrentPage] = useState(1);
  const varietiesPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:3001/api/varieties')
      .then(res => res.json())
      .then(data => {
        setVarieties(data);
        setLoading(false);
      })
      .catch(err => console.error('Failed to fetch:', err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this variety?")) {
      fetch(`http://localhost:3001/api/varieties/${id}`, { method: 'DELETE' })
        .then(() => {
          setVarieties(varieties.filter(variety => variety.id !== id));
        })
        .catch(err => console.error('Failed to delete variety:', err));
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleFilterRating = (event) => {
    setFilterRating(event.target.value);
  };

  const handleSliderChange = (event, value) => {
    setMinYield(value[0]);
    setMaxYield(value[1]);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const filteredVarieties = varieties.filter(variety => {
    return (
      (search === '' || variety.cropName.toLowerCase().includes(search.toLowerCase()) || variety.varietyName.toLowerCase().includes(search.toLowerCase())) &&
      (filterRating === 0 || variety.healthRating === parseInt(filterRating)) &&
      (variety.expectedYield >= minYield && variety.expectedYield <= maxYield)
    );
  });

  const sortedVarieties = filteredVarieties.sort((a, b) => {
    if (sortBy === 'yield') {
      return b.expectedYield - a.expectedYield;
    }
    return new Date(b.estimatedHarvestDate) - new Date(a.estimatedHarvestDate);
  });

  const indexOfLastVariety = currentPage * varietiesPerPage;
  const indexOfFirstVariety = indexOfLastVariety - varietiesPerPage;
  const currentVarieties = sortedVarieties.slice(indexOfFirstVariety, indexOfLastVariety);

  return (
    <div>
      <h1>Crop Varieties</h1>

      <div className="toolbar">
        <input type="text" placeholder="Search Crop or Variety" value={search} onChange={handleSearch} />
        <select onChange={handleFilterRating} value={filterRating}>
          <option value={0}>All Ratings</option>
          {[1, 2, 3, 4, 5].map(rating => (
            <option key={rating} value={rating}>Rating {rating}</option>
          ))}
        </select>
        <input type="range" min={0} max={100} value={minYield} onChange={e => setMinYield(Number(e.target.value))} />
        <input type="range" min={0} max={100} value={maxYield} onChange={e => setMaxYield(Number(e.target.value))} />
        <select onChange={handleSortChange} value={sortBy}>
          <option value="yield">Sort by Yield</option>
          <option value="harvest">Sort by Harvest Date</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="variety-list">
          {currentVarieties.map(variety => (
            <div key={variety.id} className="variety-card">
              <h2>{variety.varietyName}</h2>
              <p>Crop: {variety.cropName}</p>
              <p>Expected Yield: {variety.expectedYield}</p>
              <p>Estimated Harvest Date: {variety.estimatedHarvestDate}</p>
              <p>Health Rating: {variety.healthRating}</p>
              <Link href={`/manage/${variety.id}`}>Edit</Link>
              <button onClick={() => handleDelete(variety.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * varietiesPerPage >= sortedVarieties.length}>Next</button>
      </div>
    </div>
  );
}

export default Dashboard;
