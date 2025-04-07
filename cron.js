require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const fetchRoadData = require('./services/fetchRoadData');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 연결 성공');

    // 12시간마다 실행 (0시, 12시)
    cron.schedule('0 */12 * * *', () => {
      console.log('⏰ [크론] 돌발정보 수집 시작');
      fetchRoadData();
    });

    // 처음 실행 시 1회 실행
    fetchRoadData();
  })
  .catch(err => console.error('❌ MongoDB 연결 실패:', err.message));
