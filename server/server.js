// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();

// Middleware to allow cross-origin requests and parse JSON
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URL
const mongoDBURL = 'mongodb://localhost:27017/cropVarieties'; // Ensure MongoDB is running on localhost:27017

// Connect to MongoDB
mongoose
  .connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


// Define Crop model with required fields
const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  scientificName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }
});

const Crop = mongoose.model('Crop', cropSchema);

// Endpoint to get all crops
// Endpoint to get all crops with pagination
app.get('/crops', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    try {
      const crops = await Crop.find().skip(skip).limit(limit);
      const totalCrops = await Crop.countDocuments();
  
      res.json({
        crops,
        totalPages: Math.ceil(totalCrops / limit),
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching crops' });
    }
  });
  

// Endpoint to add a new crop
// server.js
app.post('/crops', async (req, res) => {
    const { name, scientificName, description, region, imageUrl } = req.body;
  
    const newCrop = new Crop({
      name,
      scientificName,
      description,
      region,
      imageUrl,
    });
  
    try {
      await newCrop.save();
      res.status(201).json(newCrop);
    } catch (error) {
      console.error('Error adding crop:', error); // Log the error
      res.status(500).json({ message: 'Error adding crop', error: error.message }); // Include error message
    }
  });
  


// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
