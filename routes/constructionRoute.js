const express = require('express');
const router = express.Router();
const RoadConstruction = require('../models/RoadConstruction');

router.get('/', async (req, res) => {
  try {
    const data = await RoadConstruction.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
