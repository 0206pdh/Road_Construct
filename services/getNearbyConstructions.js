const RoadConstruction = require('../models/RoadConstruction');

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // ���� ������ (m)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function getNearbyConstructions(lat, lng, radius) {
  const all = await RoadConstruction.find({});
  return all.filter(item => {
    const d = getDistance(lat, lng, item.lat, item.lng);
    return d <= radius;
  });
}

module.exports = getNearbyConstructions;
