const axios = require('axios');
const xml2js = require('xml2js');
const RoadConstruction = require('../models/RoadConstruction');

const parser = new xml2js.Parser();

const fetchRoadData = async () => {
  try {
    const { data } = await axios.get('https://safemap.go.kr/openApiService/data/getCntwrkSttusData.do', {
      params: {
        authApiKey: process.env.API_KEY,
        numOfRows: 1000,
        pageNo: 1
      }
    });

    const result = await parser.parseStringPromise(data);
    console.log('📦 응답 전체 구조 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');
    console.log(JSON.stringify(result, null, 2));
    const items = result?.response?.body?.[0]?.items?.[0]?.item || [];

    console.log(`📦 전체 데이터 개수: ${items.length}`);
    for (let item of items) {
      const signguNm = item.signguNm?.[0];
      //console.log(`➡️ ${signguNm} | ${name}`);
      if (signguNm !== '강남구') continue;

      const name = item.cntwrkNm?.[0];
      const lat = parseFloat(item.lat?.[0]);
      const lng = parseFloat(item.lon?.[0]);
      const address = item.roadNmAddr?.[0] || '주소 없음';
      const startDate = item.beginDe?.[0];
      const endDate = item.endDe?.[0];

      const exists = await RoadConstruction.findOne({ name, lat, lng, startDate });
      if (!exists) {
        await RoadConstruction.create({ name, lat, lng, address, startDate, endDate });
        console.log(`[+] 저장됨: ${name}`);
      }
    }

    console.log('✅ 공사 데이터 처리 완료');
  } catch (err) {
    console.error('❌ 공사 데이터 가져오기 실패:', err.message);
  }
};

module.exports = fetchRoadData;
