import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function ManageVariety() {
  const [cropName, setCropName] = useState('');
  const [varietyName, setVarietyName] = useState('');
  const [expectedYield, setExpectedYield] = useState(0);
  const [sowingDate, setSowingDate] = useState('');
  const [expectedHarvestDays, setExpectedHarvestDays] = useState(0);
  const [healthRating, setHealthRating] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [estimatedHarvestDate, setEstimatedHarvestDate] = useState('');

  const router = useRouter();
  const { id } = router.query; // Get the id parameter from the URL

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      // Fetch the existing variety details to pre-fill the form
      fetch(`http://localhost:3001/api/varieties/${id}`)
        .then(res => res.json())
        .then(data => {
          setCropName(data.cropName);
          setVarietyName(data.varietyName);
          setExpectedYield(data.expectedYield);
          setSowingDate(data.sowingDate);
          setExpectedHarvestDays(data.expectedHarvestDays);
          setHealthRating(data.healthRating);
          setEstimatedHarvestDate(data.estimatedHarvestDate);
        })
        .catch(err => console.error('Failed to fetch variety:', err));
    }
  }, [id]);

  const calculateEstimatedHarvestDate = () => {
    const sowingDateObj = new Date(sowingDate);
    sowingDateObj.setDate(sowingDateObj.getDate() + parseInt(expectedHarvestDays));
    setEstimatedHarvestDate(sowingDateObj.toISOString().split('T')[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const varietyData = { cropName, varietyName, expectedYield, sowingDate, expectedHarvestDays, healthRating, estimatedHarvestDate };
    const method = isEditMode ? 'PATCH' : 'POST';
    const url = isEditMode ? `http://localhost:3001/api/varieties/${id}` : 'http://localhost:3001/api/varieties';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(varietyData)
    })
      .then(res => res.json())
      .then(data => {
        router.push('/'); // Navigate back to the homepage after submission
      })
      .catch(err => console.error('Failed to submit:', err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Crop Name</label>
      <input type="text" value={cropName} onChange={e => setCropName(e.target.value)} required />

      <label>Variety Name</label>
      <input type="text" value={varietyName} onChange={e => setVarietyName(e.target.value)} required />

      <label>Expected Yield</label>
      <input type="number" value={expectedYield} onChange={e => setExpectedYield(e.target.value)} required min="0" />

      <label>Sowing Date</label>
      <input type="date" value={sowingDate} onChange={e => setSowingDate(e.target.value)} required />

      <label>Expected Harvest Days</label>
      <input type="number" value={expectedHarvestDays} onChange={e => setExpectedHarvestDays(e.target.value)} required min="0" />

      <label>Health Rating</label>
      <input type="number" value={healthRating} onChange={e => setHealthRating(e.target.value)} required min="1" max="5" />

      <label>Estimated Harvest Date: {estimatedHarvestDate}</label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default ManageVariety;