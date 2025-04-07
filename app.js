require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const RoadConstruction = require('./models/RoadConstruction');
const nearbyRoute = require('./routes/nearbyRoute'); // ✅ 추가


const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB 연결 성공'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err.message));

app.get('/api/constructions', async (req, res) => {
  const { lat, lng, radius = 1 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'lat, lng가 필요합니다' });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const R = 6371; // 지구 반지름 (km)

  const toRad = deg => deg * Math.PI / 180;

  const constructions = await RoadConstruction.find();
  const nearby = constructions.filter(con => {
    const dLat = toRad(con.lat - userLat);
    const dLng = toRad(con.lng - userLng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLat)) *
      Math.cos(toRad(con.lat)) *
      Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d <= radius;
  });

  res.json(nearby);
});

app.use('/api/nearby', nearbyRoute); // ✅ 라우터 등록
app.listen(PORT, () => console.log(`🚀 서버 실행 중: http://localhost:${PORT}`));
