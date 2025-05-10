import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Grid, Card, CardContent, CardMedia, Paper } from '@mui/material';

const Home = () => {
  const [crops, setCrops] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/crops?page=${currentPage}&limit=10`);
        setCrops(response.data.crops);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };
    fetchCrops();
  }, [currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cropData = { name, scientificName, description, region, imageUrl };
      await axios.post('http://localhost:5000/crops', cropData);
      alert('Crop added successfully');
      setName('');
      setScientificName('');
      setDescription('');
      setRegion('');
      setImageUrl('');
      // Re-fetch the crops after adding a new one
      const response = await axios.get('http://localhost:5000/crops');
      setCrops(response.data.crops);
    } catch (error) {
      console.error('Error adding crop:', error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h3" gutterBottom align="center" style={{ color: '#4CAF50' }}>
        Crop Varieties
      </Typography>

      {/* Display crops */}
      {crops.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          Loading crops...
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {crops.map((crop) => (
            <Grid item xs={12} sm={6} md={4} key={crop._id}>
              <Card elevation={3} style={{ borderRadius: '10px' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={crop.imageUrl}
                  alt={crop.name}
                  style={{ objectFit: 'cover', borderRadius: '10px 10px 0 0' }}
                />
                <CardContent style={{ padding: '16px' }}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                    {crop.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {crop.scientificName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                    {crop.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                    Region: {crop.region}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{ marginRight: '10px' }}
        >
          Previous
        </Button>
        <Typography variant="body1" style={{ margin: '0 20px', alignSelf: 'center' }}>
          {` Page ${currentPage} of ${totalPages} `}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ marginLeft: '10px' }}
        >
          Next
        </Button>
      </div>

      {/* Form to add new crop */}
      <Paper elevation={3} style={{ padding: '20px', marginTop: '30px' }}>
        <Typography variant="h5" style={{ marginBottom: '20px', color: '#4CAF50' }}>
          Add Crop Variety
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <TextField
            label="Scientific Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setScientificName(e.target.value)}
            value={scientificName}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <TextField
            label="Region"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setRegion(e.target.value)}
            value={region}
          />
          <TextField
            label="Image URL"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setImageUrl(e.target.value)}
            value={imageUrl}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '20px' }}>
            Add Crop
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Home;
