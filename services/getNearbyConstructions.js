const RoadConstruction = require('../models/RoadConstruction');

const getNearbyConstructions = async (userLat, userLng, radius = 500) => {
  const R = 6371000; // 지구 반지름(m)

  const toRad = deg => (deg * Math.PI) / 180;

  const constructions = await RoadConstruction.find();

  const nearby = constructions.filter(con => {
    const dLat = toRad(parseFloat(con.lat) - userLat);
    const dLng = toRad(parseFloat(con.lng) - userLng);


    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLat)) *
        Math.cos(toRad(con.lat)) *
        Math.sin(dLng / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    console.log(con); // 🔍 확인용
    console.log(`📍 ${con.name} 까지 거리: ${distance.toFixed(2)}m`);
    return distance <= radius;
    
  });

  return nearby;
};

module.exports = getNearbyConstructions;
