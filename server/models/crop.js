// models/Crop.js

const mongoose = require('mongoose');

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
      required: true, // Or make optional if necessary
    },
  });
  

const Crop = mongoose.model('Crop', cropSchema);
module.exports = Crop;
