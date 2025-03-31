require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const fetchRoadData = require('./services/fetchRoadData');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공');

    // 1시간마다 실행
    cron.schedule('0 * * * *', () => {
      console.log('⏰ [크론] 도로공사 정보 수집 시작');
      fetchRoadData();
    });

    // 처음 실행 시 즉시 1회 실행
    fetchRoadData();
  })
  .catch(err => console.error('❌ MongoDB 연결 실패:', err.message));
