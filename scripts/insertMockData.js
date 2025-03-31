require('dotenv').config();
const mongoose = require('mongoose');
const RoadConstruction = require('../models/RoadConstruction');
const fs = require('fs');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB 연결됨');

    const rawData = fs.readFileSync('./mock_construction_data.json', 'utf-8');
    const mockData = JSON.parse(rawData);

    for (const item of mockData) {
      const exists = await RoadConstruction.findOne({ name: item.name, lat: item.lat });
      if (!exists) {
        await RoadConstruction.create(item);
        console.log(`[+] 삽입됨: ${item.name}`);
      }
    }

    console.log('🎉 테스트 데이터 삽입 완료!');
    mongoose.disconnect();
  })
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));
