const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let varieties = [
  {
    id: uuidv4(),
    cropName: 'Tomato',
    varietyName: 'Cherry',
    expectedYield: 25,
    estimatedHarvestDate: '2025-06-20',
    healthRating: 4
  },
  {
    id: uuidv4(),
    cropName: 'Lettuce',
    varietyName: 'Butterhead',
    expectedYield: 18,
    estimatedHarvestDate: '2025-06-15',
    healthRating: 3
  }
];

app.get('/api/varieties', (req, res) => {
  res.json(varieties);
});

app.post('/api/varieties', (req, res) => {
  const { cropName, varietyName, expectedYield, sowingDate, expectedHarvestDays, healthRating } = req.body;

  if (!cropName || !varietyName || expectedYield < 0 || !sowingDate || expectedHarvestDays < 0 || healthRating < 1 || healthRating > 5) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const estimatedHarvestDate = new Date(sowingDate);
  estimatedHarvestDate.setDate(estimatedHarvestDate.getDate() + parseInt(expectedHarvestDays));

  const newVariety = {
    id: uuidv4(),
    cropName,
    varietyName,
    expectedYield: Number(expectedYield),
    estimatedHarvestDate: estimatedHarvestDate.toISOString().split('T')[0],
    healthRating: Number(healthRating)
  };

  varieties.push(newVariety);
  res.status(201).json(newVariety);
});

// Optional PATCH route for updating a variety
app.patch('/api/varieties/:id', (req, res) => {
  const { id } = req.params;
  const variety = varieties.find(v => v.id === id);

  if (!variety) {
    return res.status(404).json({ message: 'Variety not found' });
  }

  const { cropName, varietyName, expectedYield, sowingDate, expectedHarvestDays, healthRating } = req.body;

  if (cropName) variety.cropName = cropName;
  if (varietyName) variety.varietyName = varietyName;
  if (expectedYield >= 0) variety.expectedYield = expectedYield;
  if (sowingDate && expectedHarvestDays >= 0) {
    const estHarvest = new Date(sowingDate);
    estHarvest.setDate(estHarvest.getDate() + parseInt(expectedHarvestDays));
    variety.estimatedHarvestDate = estHarvest.toISOString().split('T')[0];
  }
  if (healthRating >= 1 && healthRating <= 5) variety.healthRating = healthRating;

  res.json(variety);
});

app.delete('/api/varieties/:id', (req, res) => {
  const { id } = req.params;
  const index = varieties.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Variety not found' });
  }

  varieties.splice(index, 1);
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});

