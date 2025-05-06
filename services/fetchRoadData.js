const axios = require('axios');
const xml2js = require('xml2js');
const RoadConstruction = require('../models/RoadConstruction');
const { Transformer } = require('proj4'); // pyproj는 Python용, Node에선 proj4 또는 node-proj4 사용

const proj4 = require('proj4');
//proj4.defs("EPSG:5181", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=1.0 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs");
// 서울시 TM 좌표계를 EPSG:2097로 정의
proj4.defs("EPSG:2097", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs");

const fetchRoadData = async () => {
  try {
    const { data } = await axios.get(
      `http://openapi.seoul.go.kr:8088/${process.env.API_KEY}/xml/AccInfo/1/100`
    );

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    const items = result?.AccInfo?.row || [];

    console.log(`🦺 전체 돌발 데이터 개수: ${items.length}`);

    for (let item of items) {
      const accType = item.acc_type?.[0];
      const occrDate = item.occr_date?.[0];
      const occrTime = item.occr_time?.[0];
      const tmX = parseFloat(item.grs80tm_x?.[0]);
      const tmY = parseFloat(item.grs80tm_y?.[0]);
      const linkId = item.link_id?.[0] || 'N/A';

      if (isNaN(tmX) || isNaN(tmY)) {
        console.warn(`⚠️ 유효하지 않은 좌표로 인해 건너뜀: ${item.acc_id?.[0]}`);
        continue;
      }

      //const [lng, lat] = proj4("EPSG:5181", "WGS84", [tmX, tmY]);
      const [lng, lat] = proj4("EPSG:2097", "WGS84", [tmX, tmY]);
      // 콘솔 확인용 로그
      console.log(`📍 좌표변환: TM(${tmX}, ${tmY}) → 위경도(${lng}, ${lat})`);

      const name = `${accType} 발생 (${occrDate} ${occrTime})`;
      const address = `링크ID: ${linkId}`;

      const exists = await RoadConstruction.findOne({ name, startDate: occrDate,  address, });
      console.log(`🔍 exists 확인: ${exists ? '존재함' : '없음'} / ${name}, ${occrDate}`);
      if (!exists) {
        await RoadConstruction.create({
          name,
          lat,
          lng,
          address,
          startDate: occrDate,
          endDate: occrDate,
        });
        console.log(`[+] 저장됨: ${name}`);
      }
    }

    console.log('✅ 돌발 정보 크롤링 완료!');
  } catch (err) {
    console.error('❌ API 요청 실패:', err.message);
  }
};

module.exports = fetchRoadData;
