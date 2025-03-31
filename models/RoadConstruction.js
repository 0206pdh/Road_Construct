const mongoose = require('mongoose');

const RoadConstructionSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lng: Number,
  address: String,
  startDate: String,
  endDate: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RoadConstruction', RoadConstructionSchema);
