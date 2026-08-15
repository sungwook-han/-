// Vercel 서버리스 함수
// 배포 후 https://<내앱>.vercel.app/api/tide?obsCode=DT_0001&reqDate=20260815 형태로 호출됨
// 프론트엔드(App.jsx)에서는 이 주소를 상대경로 "/api/tide"로 호출하도록 이미 되어 있음

export default async function handler(req, res) {
  const { obsCode, reqDate } = req.query;

  if (!obsCode) {
    return res.status(400).json({ error: "obsCode 파라미터가 필요해요." });
  }

  const serviceKey = process.env.TIDE_SERVICE_KEY;
  if (!serviceKey) {
    return res.status(500).json({
      error: "서버에 TIDE_SERVICE_KEY 환경변수가 설정되어 있지 않아요. Vercel 프로젝트 설정에서 추가해주세요.",
    });
  }

  const params = new URLSearchParams({
    serviceKey,
    obsCode,
    numOfRows: "10",
    pageNo: "1",
    type: "json",
  });
  if (reqDate) params.set("reqDate", reqDate);

  const url = `https://apis.data.go.kr/1192136/tideFcstHghLw/GetTideFcstHghLwApiService?${params.toString()}`;

  try {
    const upstream = await fetch(url);
    const text = await upstream.text();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate"); // 5분 캐시
    return res.status(200).send(text);
  } catch (err) {
    return res.status(502).json({ error: "상위 API 호출 실패", detail: String(err) });
  }
}
