// routes/nearbyRoute.js
const express = require('express');
const router = express.Router();
const getNearbyConstructions = require('../services/getNearbyConstructions');

router.get('/', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: '위도(lat)와 경도(lng)를 쿼리로 입력하세요.' });
  }

  try {
    const nearby = await getNearbyConstructions(parseFloat(lat), parseFloat(lng));
    res.json(nearby);
  } catch (err) {
    res.status(500).json({ error: '서버 오류', details: err.message });
  }
});

module.exports = router;
