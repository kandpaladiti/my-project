// pages/crops/[id].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, CircularProgress } from '@mui/material';

const CropDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/crops/${id}`)
        .then((res) => {
          setCrop(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch crop details:', err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <CircularProgress style={{ marginTop: '2rem' }} />;

  if (!crop) return <Typography variant="h6">Crop not found.</Typography>;

  return (
    <Container>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>{crop.name}</Typography>
          <Typography variant="h6">Description:</Typography>
          <Typography paragraph>{crop.description}</Typography>

          <Typography variant="h6">Expected Yield:</Typography>
          <Typography paragraph>{crop.expectedYield} kg/ha</Typography>

          <Typography variant="h6">Sowing Date:</Typography>
          <Typography paragraph>{crop.sowingDate}</Typography>

          <Typography variant="h6">Harvest in:</Typography>
          <Typography paragraph>{crop.harvestDays} days</Typography>

          <Typography variant="h6">Estimated Harvest Date:</Typography>
          <Typography paragraph>{crop.estimatedHarvestDate}</Typography>

          <Typography variant="h6">Health Rating:</Typography>
          <Typography paragraph>{crop.healthRating} / 5</Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CropDetails;
