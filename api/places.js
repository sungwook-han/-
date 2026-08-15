// Vercel 서버리스 함수
// 카카오 로컬 API - 카테고리로 장소 검색 (음식점/카페)
// 배포 후 /api/places?lat=..&lon=..&category=FD6&radius=5000 형태로 호출됨
// REST API 키는 절대 프론트엔드에 노출하지 않고 이 서버 함수 안에서만 사용해요.

export default async function handler(req, res) {
  const { lat, lon, category, radius } = req.query;

  if (!lat || !lon || !category) {
    return res.status(400).json({ error: "lat, lon, category 파라미터가 필요해요." });
  }

  const restKey = process.env.KAKAO_REST_KEY;
  if (!restKey) {
    return res.status(500).json({
      error: "서버에 KAKAO_REST_KEY 환경변수가 설정되어 있지 않아요. Vercel 프로젝트 설정에서 추가해주세요.",
    });
  }

  const params = new URLSearchParams({
    category_group_code: category, // FD6: 음식점, CE7: 카페
    x: lon,
    y: lat,
    radius: radius || "5000",
    sort: "distance",
    size: "15",
  });

  const url = `https://dapi.kakao.com/v2/local/search/category.json?${params.toString()}`;

  try {
    const upstream = await fetch(url, {
      headers: { Authorization: `KakaoAK ${restKey}` },
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.message || "카카오 API 오류" });
    }
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: "상위 API 호출 실패", detail: String(err) });
  }
}
