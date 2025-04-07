const mongoose = require('mongoose');

const RoadConstructionSchema = new mongoose.Schema({
  name: String,       // 공사 이름
  address: String,    // 주소
  startDate: String,  // 시작 일시
  endDate: String,    // 종료 일시
  lat: Number,        // 위도
  lng: Number         // 경도
});

module.exports = mongoose.model('RoadConstruction', RoadConstructionSchema);
