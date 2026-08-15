import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudDrizzle,
  CloudSnow, CloudFog, CloudLightning, Wind, Droplets,
  Search, MapPin, Loader2, ChevronDown, ChevronLeft, ChevronRight,
  ArrowUp, ArrowDown, AlertTriangle, Anchor, CloudRainWind, Navigation, Utensils, Compass, Maximize2, X,
} from "lucide-react";

// 내 위치를 못 가져올 때 수동 선택용 (내륙 포함 주요 도시)
const FALLBACK_CITIES = [
  { name: "서울", lat: 37.5665, lon: 126.978 },
  { name: "부산", lat: 35.1796, lon: 129.0756 },
  { name: "인천", lat: 37.4563, lon: 126.7052 },
  { name: "대구", lat: 35.8714, lon: 128.6014 },
  { name: "광주", lat: 35.1595, lon: 126.8526 },
  { name: "대전", lat: 36.3504, lon: 127.3845 },
  { name: "울산", lat: 35.5384, lon: 129.3114 },
  { name: "수원", lat: 37.2636, lon: 127.0286 },
  { name: "춘천", lat: 37.8813, lon: 127.7298 },
  { name: "강릉", lat: 37.7519, lon: 128.8761 },
  { name: "전주", lat: 35.8242, lon: 127.148 },
  { name: "제주", lat: 33.4996, lon: 126.5312 },
];

// 가고 싶은 위치(목적지) 후보 — 물때 관측소 목록 (날씨+물때 둘 다 이 좌표 기준)
const DESTINATIONS = [
  { code: "DT_0001", name: "인천", lat: 37.4526, lon: 126.5967 },
  { code: "DT_0002", name: "평택", lat: 36.9668, lon: 126.8225 },
  { code: "DT_0003", name: "영광", lat: 35.35, lon: 126.30 },
  { code: "DT_0004", name: "제주", lat: 33.5097, lon: 126.5219 },
  { code: "DT_0005", name: "부산", lat: 35.0951, lon: 129.0403 },
  { code: "DT_0006", name: "묵호", lat: 37.5507, lon: 129.1147 },
  { code: "DT_0007", name: "목포", lat: 34.7936, lon: 126.3886 },
  { code: "DT_0008", name: "안산", lat: 37.3219, lon: 126.6309 },
  { code: "DT_0010", name: "서귀포", lat: 33.2494, lon: 126.5606 },
  { code: "DT_0011", name: "후포", lat: 36.6772, lon: 129.4534 },
  { code: "DT_0012", name: "속초", lat: 38.207, lon: 128.5918 },
  { code: "DT_0013", name: "울릉도", lat: 37.4844, lon: 130.9057 },
  { code: "DT_0014", name: "통영", lat: 34.8544, lon: 128.4331 },
  { code: "DT_0016", name: "여수", lat: 34.7604, lon: 127.6622 },
  { code: "DT_0017", name: "대산", lat: 37.0031, lon: 126.3583 },
  { code: "DT_0018", name: "군산", lat: 35.9678, lon: 126.6369 },
  { code: "DT_0020", name: "울산", lat: 35.5384, lon: 129.3114 },
  { code: "DT_0021", name: "추자도", lat: 33.9636, lon: 126.3011 },
  { code: "DT_0022", name: "성산포", lat: 33.4712, lon: 126.9273 },
  { code: "DT_0023", name: "모슬포", lat: 33.2136, lon: 126.2513 },
  { code: "DT_0024", name: "장항", lat: 36.0075, lon: 126.6919 },
  { code: "DT_0025", name: "보령", lat: 36.3504, lon: 126.4936 },
  { code: "DT_0026", name: "고흥발포", lat: 34.4711, lon: 127.3428 },
  { code: "DT_0027", name: "완도", lat: 34.3111, lon: 126.755 },
  { code: "DT_0028", name: "진도", lat: 34.4867, lon: 126.2633 },
  { code: "DT_0029", name: "거제도", lat: 34.8806, lon: 128.6211 },
  { code: "DT_0031", name: "거문도", lat: 34.0306, lon: 127.3125 },
  { code: "DT_0032", name: "강화대교", lat: 37.7275, lon: 126.4753 },
  { code: "DT_0035", name: "흑산도", lat: 34.6844, lon: 125.4325 },
  { code: "DT_0036", name: "대청도", lat: 37.8236, lon: 124.7014 },
  { code: "DT_0037", name: "어청도", lat: 36.1181, lon: 125.9847 },
  { code: "DT_0038", name: "굴업도", lat: 37.1969, lon: 126.0397 },
  { code: "DT_0049", name: "광양", lat: 34.9406, lon: 127.6958 },
  { code: "DT_0050", name: "태안", lat: 36.7455, lon: 126.2977 },
  { code: "DT_0052", name: "인천송도", lat: 37.3894, lon: 126.6407 },
  { code: "DT_0054", name: "진해", lat: 35.1497, lon: 128.7003 },
  { code: "DT_0057", name: "동해항", lat: 37.5075, lon: 129.1272 },
  { code: "DT_0059", name: "백령도", lat: 37.9636, lon: 124.6339 },
  { code: "DT_0060", name: "연평도", lat: 37.6664, lon: 125.6942 },
  { code: "DT_0061", name: "삼천포", lat: 34.9328, lon: 128.0658 },
  { code: "DT_0062", name: "마산", lat: 35.2038, lon: 128.5708 },
  { code: "DT_0063", name: "가덕도", lat: 35.0333, lon: 128.8083 },
  { code: "DT_0065", name: "덕적도", lat: 37.2306, lon: 126.1494 },
  { code: "DT_0067", name: "안흥", lat: 36.6742, lon: 126.1428 },
  { code: "DT_0068", name: "위도", lat: 35.6153, lon: 126.2989 },
  { code: "DT_0091", name: "포항", lat: 36.0375, lon: 129.365 },
];

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function findNearestStation(lat, lon) {
  let best = null, bestDist = Infinity;
  for (const s of DESTINATIONS) {
    const d = haversineKm(lat, lon, s.lat, s.lon);
    if (d < bestDist) { bestDist = d; best = s; }
  }
  return { station: best, distanceKm: bestDist };
}
function AddressSearchBox({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const ref = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setSearching(true);
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=kr&accept-language=ko&limit=6`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data) => { setResults(data || []); setOpen(true); })
        .catch(() => {})
        .finally(() => setSearching(false));
    }, 450);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(15,23,31,0.1)", border: "1px solid rgba(15,23,31,0.25)", borderRadius: 20, padding: "7px 12px" }}>
        <Search size={13} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="주소 또는 지명 검색 (예: 여수시 돌산읍)"
          style={{ background: "none", border: "none", outline: "none", color: "#1A1F26", fontSize: 12.5, width: "100%" }}
        />
        {searching && <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />}
      </div>
      {open && results.length > 0 && (
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, zIndex: 20, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(14px)", borderRadius: 12, padding: 6, border: "1px solid rgba(15,23,31,0.15)", maxHeight: 240, overflowY: "auto" , boxShadow: "0 8px 24px rgba(15,23,31,0.12)" }}>
          {results.map((r) => (
            <div
              key={r.place_id}
              onClick={() => {
                const shortName = r.display_name.split(",").slice(0, 2).join(",").trim();
                onSelect({ lat: parseFloat(r.lat), lon: parseFloat(r.lon), name: shortName });
                setQuery(shortName);
                setOpen(false);
              }}
              style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12.5 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(15,23,31,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {r.display_name}
            </div>
          ))}
        </div>
      )}
      {open && !searching && query.trim() && results.length === 0 && (
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, zIndex: 20, background: "rgba(255,255,255,0.96)", borderRadius: 12, padding: "10px 12px", fontSize: 12, opacity: 0.6, border: "1px solid rgba(15,23,31,0.15)" , boxShadow: "0 8px 24px rgba(15,23,31,0.12)" }}>
          검색 결과가 없어요
        </div>
      )}
    </div>
  );
}



function weatherMeta(code, isDay) {
  const day = isDay !== 0;
  const table = {
    0: { label: "맑음", Icon: day ? Sun : Moon },
    1: { label: "대체로 맑음", Icon: day ? CloudSun : CloudMoon },
    2: { label: "구름 조금", Icon: day ? CloudSun : CloudMoon },
    3: { label: "흐림", Icon: Cloud },
    45: { label: "안개", Icon: CloudFog }, 48: { label: "짙은 안개", Icon: CloudFog },
    51: { label: "약한 이슬비", Icon: CloudDrizzle }, 53: { label: "이슬비", Icon: CloudDrizzle }, 55: { label: "강한 이슬비", Icon: CloudDrizzle },
    61: { label: "약한 비", Icon: CloudRain }, 63: { label: "비", Icon: CloudRain }, 65: { label: "강한 비", Icon: CloudRain },
    71: { label: "약한 눈", Icon: CloudSnow }, 73: { label: "눈", Icon: CloudSnow }, 75: { label: "강한 눈", Icon: CloudSnow },
    80: { label: "약한 소나기", Icon: CloudRain }, 81: { label: "소나기", Icon: CloudRain }, 82: { label: "강한 소나기", Icon: CloudRain },
    85: { label: "약한 눈소나기", Icon: CloudSnow }, 86: { label: "강한 눈소나기", Icon: CloudSnow },
    95: { label: "뇌우", Icon: CloudLightning }, 96: { label: "우박 동반 뇌우", Icon: CloudLightning }, 99: { label: "강한 우박 동반 뇌우", Icon: CloudLightning },
  };
  return table[code] || { label: "정보 없음", Icon: Cloud };
}

const EXTR_META = {
  "1": { label: "오전 고조", high: true }, "2": { label: "오전 저조", high: false },
  "3": { label: "오후 고조", high: true }, "4": { label: "오후 저조", high: false },
};

function ymd(d) { return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`; }
function fmtDateLabel(d) { const days = ["일", "월", "화", "수", "목", "금", "토"]; return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`; }
function isSameDay(a, b) { return a.toDateString() === b.toDateString(); }
function moonPhaseIcon(d) {
  const synodic = 29.53058867;
  const ref = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const days = (d - ref) / 86400000;
  const phase = (((days % synodic) + synodic) % synodic) / synodic;
  return ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"][Math.round(phase * 8) % 8];
}
function timeToMinutes(t) { const d = new Date(t.replace(" ", "T")); return d.getHours() * 60 + d.getMinutes(); }
function fmtTime(t) { const d = new Date(t.replace(" ", "T")); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; }
function fmtHour(iso) { return `${new Date(iso).getHours()}시`; }

function buildCurvePath(points, w, h, padY) {
  if (points.length < 2) return "";
  const xs = points.map((p) => (p.min / 1440) * w);
  const ys = points.map((p) => h - padY - ((p.val - points.minVal) / (points.maxVal - points.minVal || 1)) * (h - padY * 2));
  let d = `M ${xs[0]},${ys[0]}`;
  for (let i = 0; i < xs.length - 1; i++) {
    const x0 = i > 0 ? xs[i - 1] : xs[i], y0 = i > 0 ? ys[i - 1] : ys[i];
    const x1 = xs[i], y1 = ys[i], x2 = xs[i + 1], y2 = ys[i + 1];
    const x3 = i < xs.length - 2 ? xs[i + 2] : x2, y3 = i < xs.length - 2 ? ys[i + 2] : y2;
    d += ` C ${x1 + (x2 - x0) / 6},${y1 + (y2 - y0) / 6} ${x2 - (x3 - x1) / 6},${y2 - (y3 - y1) / 6} ${x2},${y2}`;
  }
  return d;
}

// ---------- 지도 (OpenStreetMap + Leaflet, 완전 무료 · 키/가입 불필요) ----------
// 실제 프로젝트: npm install leaflet 후, main.jsx에 import "leaflet/dist/leaflet.css"; 추가
function leafletDivIcon(L, color, label) {
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
             <div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #ffffff;box-shadow:0 0 0 1.5px rgba(0,0,0,0.25), 0 0 0 4px ${color}33;"></div>
             <div style="margin-top:3px;font-size:11px;font-weight:700;color:${color};background:rgba(255,255,255,0.85);padding:1px 6px;border-radius:4px;white-space:nowrap;">${label}</div>
           </div>`,
    iconSize: [0, 0],
    iconAnchor: [7, 7],
  });
}

function LeafletMap({ markers, route, routeColor = "#5AB8FF", poiMarkers, height = 240 }) {
  const [L, setL] = useState(null);
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const poiLayersRef = useRef([]);

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((mod) => { if (!cancelled) setL(mod.default || mod); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!L || !elRef.current || mapRef.current) return;
    mapRef.current = L.map(elRef.current, { zoomControl: true, attributionControl: true }).setView([36.5, 127.8], 6.4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);
  }, [L]);

  // 컨테이너 크기가 바뀔 때(전체화면 전환 등) 지도 다시 계산
  useEffect(() => {
    if (!mapRef.current) return;
    const t = setTimeout(() => mapRef.current.invalidateSize(), 80);
    return () => clearTimeout(t);
  }, [height]);

  useEffect(() => {
    if (!L || !mapRef.current) return;
    if (routeLayerRef.current) { mapRef.current.removeLayer(routeLayerRef.current); routeLayerRef.current = null; }
    if (route && route.length > 1) {
      routeLayerRef.current = L.polyline(route, { color: routeColor, weight: 4, opacity: 0.85, dashArray: "1,8", lineCap: "round" }).addTo(mapRef.current);
    }
  }, [L, route, routeColor]);

  useEffect(() => {
    if (!L || !mapRef.current) return;
    poiLayersRef.current.forEach((m) => mapRef.current.removeLayer(m));
    poiLayersRef.current = [];
    (poiMarkers || []).forEach((p) => {
      const m = L.circleMarker([p.lat, p.lon], { radius: 5, color: "white", weight: 1.5, fillColor: p.color, fillOpacity: 0.9 })
        .bindPopup(`<b>${p.name}</b><br/>${p.typeLabel}`)
        .addTo(mapRef.current);
      poiLayersRef.current.push(m);
    });
  }, [L, poiMarkers]);

  useEffect(() => {
    if (!L || !mapRef.current) return;
    layersRef.current.forEach((m) => mapRef.current.removeLayer(m));
    layersRef.current = [];
    const pts = [];
    markers.filter(Boolean).forEach((mk) => {
      const m = L.marker([mk.lat, mk.lon], { icon: leafletDivIcon(L, mk.color, mk.label) }).addTo(mapRef.current);
      layersRef.current.push(m);
      pts.push([mk.lat, mk.lon]);
    });
    if (pts.length === 2) mapRef.current.fitBounds(pts, { padding: [40, 40], maxZoom: 10 });
    else if (pts.length === 1) mapRef.current.setView(pts[0], 9);
  }, [L, markers]);

  const heightStyle = typeof height === "number" ? `${height}px` : height;

  if (!L) {
    return (
      <div style={{ height: heightStyle, borderRadius: 12, background: "rgba(15,23,31,0.06)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: 12.5, opacity: 0.6, padding: 16 }}>
        지도는 배포된 앱에서 표시돼요.<br />(로컬 프로젝트에 leaflet 설치 필요: npm install leaflet)
      </div>
    );
  }
  return <div ref={elRef} style={{ height: heightStyle, borderRadius: 12, overflow: "hidden" }} />;
}

function SectionCard({ children, accent }) {
  return <div style={{ background: "#FAFAFA", border: `1px solid ${accent ? accent + "55" : "rgba(15,23,31,0.1)"}`, borderRadius: 16, padding: "18px 16px", boxShadow: "0 1px 3px rgba(15,23,31,0.04)" }}>{children}</div>;
}

function LocationPicker({ label, value, onChange, list, matchKey = "name" }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const filtered = list.filter((c) => c[matchKey].includes(search));
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((s) => !s)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(15,23,31,0.1)", border: "1px solid rgba(15,23,31,0.25)", borderRadius: 20, padding: "7px 14px", color: "#1A1F26", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>
        <MapPin size={13} /> {value[matchKey]} <ChevronDown size={13} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: 40, right: 0, width: 200, zIndex: 20, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(14px)", borderRadius: 12, padding: 10, border: "1px solid rgba(15,23,31,0.15)" , boxShadow: "0 8px 24px rgba(15,23,31,0.12)" }}>
          <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6 }}>{label}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(15,23,31,0.08)", borderRadius: 8, padding: "6px 10px", marginBottom: 8 }}>
            <Search size={12} />
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="검색" style={{ background: "none", border: "none", outline: "none", color: "#1A1F26", fontSize: 12.5, width: "100%" }} />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.map((c) => (
              <div key={c[matchKey]} onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                style={{ padding: "7px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: c[matchKey] === value[matchKey] ? 700 : 400, background: c[matchKey] === value[matchKey] ? "rgba(79,214,192,0.18)" : "transparent" }}>
                {c[matchKey]}
              </div>
            ))}
            {filtered.length === 0 && <div style={{ fontSize: 12, opacity: 0.5, padding: 6 }}>결과 없음</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// 좌표 기반 날씨 표시 (내 위치 / 목적지 공용)
function WeatherBlock({ lat, lon }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day&daily=precipitation_probability_max&hourly=temperature_2m,weather_code&timezone=Asia%2FSeoul&forecast_days=1`;
    fetch(url).then((r) => r.json()).then((j) => { if (!cancelled) setData(j); })
      .catch(() => { if (!cancelled) setError("날씨 정보를 불러오지 못했어요."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [lat, lon]);

  const meta = data ? weatherMeta(data.current.weather_code, data.current.is_day) : null;
  const hourly = useMemo(() => {
    if (!data) return [];
    const nowISO = data.current.time;
    let idx = data.hourly.time.findIndex((t) => t >= nowISO);
    if (idx === -1) idx = 0;
    return data.hourly.time.slice(idx, idx + 6).map((t, i) => ({ time: t, temp: Math.round(data.hourly.temperature_2m[idx + i]), code: data.hourly.weather_code[idx + i] }));
  }, [data]);

  if (loading) return <div style={{ textAlign: "center", padding: "18px 0", opacity: 0.7 }}><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /></div>;
  if (error) return <div style={{ textAlign: "center", padding: "14px 0", fontSize: 12.5, opacity: 0.7 }}>{error}</div>;
  if (!data) return null;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <meta.Icon size={38} color="#4FD6C0" />
        <div>
          <div className="sg" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{Math.round(data.current.temperature_2m)}°</div>
          <div style={{ fontSize: 12.5, opacity: 0.8, marginTop: 2 }}>{meta.label} · 체감 {Math.round(data.current.apparent_temperature)}°</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 12 }}>
        {[
          { icon: Droplets, label: "습도", value: `${data.current.relative_humidity_2m}%` },
          { icon: Wind, label: "바람", value: `${Math.round(data.current.wind_speed_10m)}km/h` },
          { icon: CloudRainWind, label: "강수확률", value: `${data.daily.precipitation_probability_max[0]}%` },
        ].map((s) => (
          <div key={s.label} style={{ background: "rgba(15,23,31,0.07)", borderRadius: 10, padding: "7px 4px", textAlign: "center" }}>
            <s.icon size={13} style={{ marginBottom: 3, opacity: 0.8 }} />
            <div style={{ fontSize: 10, opacity: 0.65 }}>{s.label}</div>
            <div className="sg" style={{ fontSize: 12.5, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
        {hourly.map((h, i) => {
          const hm = weatherMeta(h.code, 1);
          return (
            <div key={h.time} style={{ flex: "0 0 auto", width: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "7px 2px", borderRadius: 10, background: i === 0 ? "rgba(15,23,31,0.12)" : "transparent" }}>
              <div style={{ fontSize: 9.5, opacity: 0.7 }}>{i === 0 ? "지금" : fmtHour(h.time)}</div>
              <hm.Icon size={14} />
              <div className="sg" style={{ fontSize: 11.5, fontWeight: 700 }}>{h.temp}°</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// 물때 블록 (목적지 전용)
function TideBlock({ station }) {
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(""); setItems(null);
    fetch(`/api/tide?obsCode=${station.code}&reqDate=${ymd(date)}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const body = json?.response?.body, header = json?.response?.header;
        if (!body) { setError(header?.resultMsg || json?.error || "응답을 확인할 수 없어요."); return; }
        if (header?.resultCode !== "00") { setError(`${header?.resultMsg || "오류"} (${header?.resultCode})`); return; }
        let raw = body.items?.item || [];
        if (!Array.isArray(raw)) raw = [raw];
        setItems(raw);
      })
      .catch(() => { if (!cancelled) setError("프록시(/api/tide) 미배포 상태예요. Vercel 배포 후 정상 작동해요."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [station, date]);

  const points = useMemo(() => {
    if (!items) return [];
    return items.map((it) => ({ time: it.predcDt, min: timeToMinutes(it.predcDt), val: parseFloat(it.predcTdlvVl), meta: EXTR_META[it.extrSe] || { label: "-", high: null } })).sort((a, b) => a.min - b.min);
  }, [items]);

  const curveD = useMemo(() => {
    if (points.length < 2) return "";
    const vals = points.map((p) => p.val);
    const arr = points.slice();
    arr.minVal = Math.min(...vals); arr.maxVal = Math.max(...vals);
    return buildCurvePath(arr, 500, 110, 18);
  }, [points]);

  const today = new Date();
  const nowMin = today.getHours() * 60 + today.getMinutes();

  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(15,23,31,0.1)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div className="serif" style={{ fontSize: 14, fontWeight: 900, display: "flex", alignItems: "center", gap: 6 }}>
          <Anchor size={14} color="#4FD6C0" /> 물때
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setDate((d) => new Date(d.getTime() - 86400000))} style={{ background: "rgba(15,23,31,0.08)", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", color: "#1A1F26" }}><ChevronLeft size={12} /></button>
          <span style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>{moonPhaseIcon(date)} {fmtDateLabel(date)}</span>
          <button onClick={() => setDate((d) => new Date(d.getTime() + 86400000))} style={{ background: "rgba(15,23,31,0.08)", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", color: "#1A1F26" }}><ChevronRight size={12} /></button>
        </div>
      </div>

      {loading && <div style={{ textAlign: "center", padding: "16px 0" }}><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /></div>}
      {!loading && error && (
        <div style={{ display: "flex", gap: 8, background: "rgba(224,142,69,0.15)", border: "1px solid rgba(224,142,69,0.4)", borderRadius: 10, padding: "10px 12px", fontSize: 12 }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, color: "#E08E45" }} /><div>{error}</div>
        </div>
      )}
      {!loading && !error && points.length > 0 && (
        <>
          <svg viewBox="0 0 500 110" width="100%" style={{ marginBottom: 6 }}>
            <defs>
              <linearGradient id="tf2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4FD6C0" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4FD6C0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${curveD} L 500,110 L 0,110 Z`} fill="url(#tf2)" />
            <path d={curveD} fill="none" stroke="#4FD6C0" strokeWidth="2" strokeLinecap="round" />
            {points.map((p, i) => {
              const vals = points.map((x) => x.val);
              const cy = 90 - ((p.val - Math.min(...vals)) / ((Math.max(...vals) - Math.min(...vals)) || 1)) * 74;
              return <circle key={i} cx={(p.min / 1440) * 500} cy={cy} r="3" fill={p.meta.high ? "#4FD6C0" : "#E08E45"} />;
            })}
            {isSameDay(date, today) && <line x1={(nowMin / 1440) * 500} y1="0" x2={(nowMin / 1440) * 500} y2="110" stroke="rgba(15,23,31,0.35)" strokeDasharray="3,3" />}
          </svg>
          <div>
            {points.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 2px", borderTop: i === 0 ? "none" : "1px solid rgba(15,23,31,0.08)" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: p.meta.high ? "rgba(79,214,192,0.18)" : "rgba(224,142,69,0.18)", color: p.meta.high ? "#4FD6C0" : "#E08E45" }}>
                  {p.meta.high ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                </div>
                <div style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{p.meta.label}</div>
                <div style={{ fontSize: 10, opacity: 0.6 }}>{p.val.toFixed(0)}cm</div>
                <div className="sg" style={{ fontSize: 13.5, fontWeight: 700 }}>{fmtTime(p.time)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const SPOT_TYPES = {
  attraction: { label: "명소", color: "#F4C463", group: "sight" },
  viewpoint: { label: "전망대", color: "#F4C463", group: "sight" },
  museum: { label: "박물관", color: "#C792EA", group: "sight" },
  gallery: { label: "갤러리", color: "#C792EA", group: "sight" },
  artwork: { label: "예술작품", color: "#C792EA", group: "sight" },
  zoo: { label: "동물원", color: "#7ED957", group: "sight" },
  theme_park: { label: "테마파크", color: "#F4C463", group: "sight" },
  historic: { label: "역사유적", color: "#E08E45", group: "sight" },
  beach: { label: "해변", color: "#4FD6C0", group: "sight" },
  park: { label: "공원", color: "#7ED957", group: "sight" },
  restaurant: { label: "음식점", color: "#FF7A59", group: "food" },
  cafe: { label: "카페", color: "#D9A066", group: "food" },
  fast_food: { label: "패스트푸드", color: "#FF7A59", group: "food" },
  bar: { label: "바", color: "#E85D75", group: "food" },
  pub: { label: "펍", color: "#E85D75", group: "food" },
};

function classifySpot(tags) {
  if (tags.amenity && SPOT_TYPES[tags.amenity]) return tags.amenity;
  if (tags.tourism && SPOT_TYPES[tags.tourism]) return tags.tourism;
  if (tags.historic) return "historic";
  if (tags.natural === "beach") return "beach";
  if (tags.leisure === "park") return "park";
  return "attraction";
}

// 카카오 로컬 API로 맛집 보강 (프록시 /api/places 필요 — 배포 전엔 실패하고 OSM 결과로 자동 대체돼요)
function useKakaoFood(dest) {
  const [items, setItems] = useState(null); // null = 아직 시도 안 함/실패, [] = 성공했지만 결과 없음
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all(
      ["FD6", "CE7"].map((cat) =>
        fetch(`/api/places?lat=${dest.lat}&lon=${dest.lon}&category=${cat}&radius=5000`).then((r) => (r.ok ? r.json() : Promise.reject()))
      )
    )
      .then(([foodRes, cafeRes]) => {
        if (cancelled) return;
        const docs = [...(foodRes.documents || []), ...(cafeRes.documents || [])];
        const parsed = docs
          .map((d) => ({
            id: d.id,
            name: d.place_name,
            lat: parseFloat(d.y),
            lon: parseFloat(d.x),
            type: d.category_group_code === "CE7" ? "cafe" : "restaurant",
            distanceKm: (parseFloat(d.distance) || haversineKm(dest.lat, dest.lon, parseFloat(d.y), parseFloat(d.x)) * 1000) / 1000,
            phone: d.phone,
            placeUrl: d.place_url,
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 10);
        setItems(parsed);
      })
      .catch(() => { if (!cancelled) setItems(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [dest]);

  return { items, loading };
}

function useNearbyPlaces(dest) {
  const [sights, setSights] = useState([]);
  const [food, setFood] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    const radius = 5000;
    const query = `[out:json][timeout:25];
(
  nwr["tourism"~"attraction|viewpoint|museum|artwork|gallery|zoo|theme_park"](around:${radius},${dest.lat},${dest.lon});
  nwr["historic"](around:${radius},${dest.lat},${dest.lon});
  nwr["natural"="beach"](around:${radius},${dest.lat},${dest.lon});
  nwr["leisure"="park"](around:${radius},${dest.lat},${dest.lon});
  nwr["amenity"~"restaurant|cafe|fast_food|bar|pub"](around:${radius},${dest.lat},${dest.lon});
);
out center 80;`;
    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const parsed = (data.elements || [])
          .map((el) => {
            const name = el.tags?.name;
            if (!name) return null;
            const lat = el.lat ?? el.center?.lat;
            const lon = el.lon ?? el.center?.lon;
            if (lat == null || lon == null) return null;
            return { id: el.id, name, lat, lon, type: classifySpot(el.tags), distanceKm: haversineKm(dest.lat, dest.lon, lat, lon) };
          })
          .filter(Boolean)
          .sort((a, b) => a.distanceKm - b.distanceKm);
        setSights(parsed.filter((p) => (SPOT_TYPES[p.type] || {}).group === "sight").slice(0, 10));
        setFood(parsed.filter((p) => (SPOT_TYPES[p.type] || {}).group === "food").slice(0, 10));
      })
      .catch(() => { if (!cancelled) setError("주변 정보를 불러오지 못했어요."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [dest]);

  return { sights, food, loading, error };
}

function PlaceListCard({ title, icon: Icon, accent, dest, items, loading, error, emptyText, sourceNote }) {
  return (
    <SectionCard accent={accent}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div className="serif" style={{ fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon size={15} color={accent} /> {dest.name} 근처 {title}
        </div>
        {sourceNote && <span style={{ fontSize: 10, opacity: 0.5 }}>{sourceNote}</span>}
      </div>
      {loading && <div style={{ textAlign: "center", padding: "16px 0" }}><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /></div>}
      {!loading && error && <div style={{ fontSize: 12.5, opacity: 0.7, textAlign: "center", padding: "10px 0" }}>{error}</div>}
      {!loading && !error && items.length === 0 && (
        <div style={{ fontSize: 12.5, opacity: 0.6, textAlign: "center", padding: "10px 0" }}>{emptyText}</div>
      )}
      {!loading && !error && items.length > 0 && (
        <div>
          {items.map((s, i) => {
            const meta = SPOT_TYPES[s.type] || SPOT_TYPES.attraction;
            const href = s.placeUrl || `https://www.openstreetmap.org/?mlat=${s.lat}&mlon=${s.lon}#map=17/${s.lat}/${s.lon}`;
            return (
              <a
                key={s.id}
                href={href}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 2px", borderTop: i === 0 ? "none" : "1px solid rgba(15,23,31,0.08)", textDecoration: "none", color: "#1A1F26" }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                  <div style={{ fontSize: 10.5, opacity: 0.6 }}>{meta.label}{s.phone ? ` · ${s.phone}` : ""}</div>
                </div>
                <div className="sg" style={{ fontSize: 11.5, opacity: 0.7, flexShrink: 0 }}>{s.distanceKm.toFixed(1)}km</div>
              </a>
            );
          })}
        </div>
      )}
      <div style={{ textAlign: "center", fontSize: 9.5, opacity: 0.4, marginTop: 10 }}>데이터: OpenStreetMap 기여자 (Overpass API)</div>
    </SectionCard>
  );
}

// 경로 정보 + 길찾기 앱 연결 (OSRM 데모 서버 — 무료, 키 불필요)
function fmtDuration(sec) {
  const m = Math.round(sec / 60);
  if (m < 60) return `${m}분`;
  return `${Math.floor(m / 60)}시간 ${m % 60}분`;
}

const ROUTE_PROFILES = {
  driving: {
    label: "자동차",
    url: (from, to) => `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`,
    color: "#5AB8FF",
    kakaoBy: "car",
    googleMode: "driving",
    appleFlag: "d",
  },
  foot: {
    label: "도보",
    url: (from, to) => `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`,
    color: "#7ED957",
    kakaoBy: "foot",
    googleMode: "walking",
    appleFlag: "w",
  },
};

function NavigationPanel({ myPlace, dest, mode }) {
  const [route, setRoute] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const profile = ROUTE_PROFILES[mode];

  useEffect(() => {
    if (!myPlace) { setRoute(null); setInfo(null); return; }
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(profile.url(myPlace, dest))
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const r0 = data.routes?.[0];
        if (!r0) { setRoute(null); setInfo(null); setError("경로를 찾지 못했어요."); return; }
        setRoute(r0.geometry.coordinates.map(([lon, lat]) => [lat, lon]));
        setInfo({ distanceKm: r0.distance / 1000, durationSec: r0.duration });
      })
      .catch(() => { if (!cancelled) { setRoute(null); setInfo(null); setError("경로 서버 응답이 없어요."); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [myPlace, dest, mode]);

  const fromName = myPlace?.name || "내 위치";
  const toName = dest.name;

  const kakaoUrl = myPlace
    ? `https://map.kakao.com/link/from/${encodeURIComponent(fromName)},${myPlace.lat},${myPlace.lon}/to/${encodeURIComponent(toName)},${dest.lat},${dest.lon}`
    : `https://map.kakao.com/link/to/${encodeURIComponent(toName)},${dest.lat},${dest.lon}`;
  const googleUrl = myPlace
    ? `https://www.google.com/maps/dir/?api=1&origin=${myPlace.lat},${myPlace.lon}&destination=${dest.lat},${dest.lon}&travelmode=${profile.googleMode}`
    : `https://www.google.com/maps/search/?api=1&query=${dest.lat},${dest.lon}`;
  const appleUrl = myPlace
    ? `https://maps.apple.com/?saddr=${myPlace.lat},${myPlace.lon}&daddr=${dest.lat},${dest.lon}&dirflg=${profile.appleFlag}`
    : `https://maps.apple.com/?daddr=${dest.lat},${dest.lon}`;

  return { route, info, loading, error, color: profile.color, kakaoUrl, googleUrl, appleUrl };
}

// ---------- 상단 위치 바 (내 위치 / 목적지를 언제든 여기서 변경) ----------
function MyLocationEditor({ myPlace, setMyPlace, onDone }) {
  const [status, setStatus] = useState("idle");

  const requestLocation = () => {
    setStatus("loading");
    if (!navigator.geolocation) { setStatus("error"); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude, lon = pos.coords.longitude;
        let name = "내 위치";
        try {
          const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ko`);
          const j = await r.json();
          name = j.locality || j.city || j.principalSubdivision || "내 위치";
        } catch {}
        setMyPlace({ lat, lon, name });
        setStatus("idle");
        onDone?.();
      },
      () => setStatus("error"),
      { timeout: 8000 }
    );
  };

  return (
    <div style={{ marginTop: 10, background: "rgba(15,23,31,0.04)", border: "1px solid rgba(15,23,31,0.1)", borderRadius: 12, padding: 12 }}>
      <button onClick={requestLocation} style={{ width: "100%", background: "#5AB8FF", border: "none", color: "#062024", borderRadius: 10, padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: status === "error" ? 10 : 0 }}>
        {status === "loading" ? "위치 확인 중..." : "GPS로 내 위치 사용하기"}
      </button>
      {status === "error" && (
        <div>
          <div style={{ fontSize: 11.5, opacity: 0.75, margin: "8px 0" }}>위치 권한을 가져오지 못했어요. 직접 선택해주세요.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {FALLBACK_CITIES.map((c) => (
              <button key={c.name} onClick={() => { setMyPlace({ lat: c.lat, lon: c.lon, name: c.name }); onDone?.(); }}
                style={{ background: "rgba(15,23,31,0.1)", border: "1px solid rgba(15,23,31,0.25)", color: "#1A1F26", borderRadius: 12, padding: "5px 10px", fontSize: 11.5, cursor: "pointer" }}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LocationBar({ myPlace, setMyPlace, dest, setDest }) {
  const [editing, setEditing] = useState(null); // 'my' | 'dest' | null

  return (
    <div style={{ padding: "10px 20px 0", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setEditing(editing === "my" ? null : "my")}
          style={{
            flex: 1, display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
            background: editing === "my" ? "rgba(90,184,255,0.22)" : "rgba(15,23,31,0.08)",
            border: "1px solid rgba(90,184,255,0.5)", color: "#5AB8FF", borderRadius: 12, padding: "9px 8px",
            fontSize: 12.5, fontWeight: 700, cursor: "pointer",
          }}
        >
          <Navigation size={13} /> {myPlace ? myPlace.name : "내 위치 설정"}
        </button>
        <button
          onClick={() => setEditing(editing === "dest" ? null : "dest")}
          style={{
            flex: 1, display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
            background: editing === "dest" ? "rgba(244,196,99,0.22)" : "rgba(15,23,31,0.08)",
            border: "1px solid rgba(244,196,99,0.5)", color: "#F4C463", borderRadius: 12, padding: "9px 8px",
            fontSize: 12.5, fontWeight: 700, cursor: "pointer",
          }}
        >
          <MapPin size={13} /> {dest.name}
        </button>
      </div>

      {editing === "my" && <MyLocationEditor myPlace={myPlace} setMyPlace={setMyPlace} onDone={() => setEditing(null)} />}
      {editing === "dest" && (
        <div style={{ marginTop: 10, background: "rgba(15,23,31,0.04)", border: "1px solid rgba(15,23,31,0.1)", borderRadius: 12, padding: 12 }}>
          <AddressSearchBox onSelect={(p) => { setDest(p); setEditing(null); }} />
        </div>
      )}
    </div>
  );
}

// ---------- 하단 탭 바 ----------
const TABS = [
  { key: "map", label: "지도", icon: MapPin, color: "#5AB8FF" },
  { key: "weather", label: "날씨", icon: Sun, color: "#F4C463" },
  { key: "tide", label: "물때", icon: Anchor, color: "#4FD6C0" },
  { key: "nearby", label: "주변", icon: Compass, color: "#C792EA" },
];

function TabBar({ active, setActive }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
      display: "flex", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(14px)",
      borderTop: "1px solid rgba(15,23,31,0.12)", padding: "8px 6px calc(8px + env(safe-area-inset-bottom))",
      boxShadow: "0 -2px 14px rgba(15,23,31,0.06)",
    }}>
      {TABS.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              background: "none", border: "none", cursor: "pointer",
              color: isActive ? t.color : "rgba(26,31,38,0.5)", padding: "4px 0",
            }}
          >
            <t.icon size={19} />
            <span style={{ fontSize: 10.5, fontWeight: isActive ? 700 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function WeatherTideApp() {
  const [myPlace, setMyPlace] = useState(null);
  const [dest, setDest] = useState(DESTINATIONS[0]);
  const [mode, setMode] = useState("driving");
  const [tab, setTab] = useState("map");
  const [mapFullscreen, setMapFullscreen] = useState(false);

  const { route, info, loading: routeLoading, error: routeError, color: routeColor, kakaoUrl, googleUrl, appleUrl } = NavigationPanel({ myPlace, dest, mode });
  const { sights, food: osmFood, loading: placesLoading, error: placesError } = useNearbyPlaces(dest);
  const { items: kakaoFood, loading: kakaoFoodLoading } = useKakaoFood(dest);
  const food = kakaoFood && kakaoFood.length > 0 ? kakaoFood : osmFood;
  const foodSource = kakaoFood && kakaoFood.length > 0 ? "kakao" : "osm";
  const { station: nearestStation, distanceKm: nearestKm } = useMemo(() => findNearestStation(dest.lat, dest.lon), [dest]);

  const markers = [
    myPlace ? { ...myPlace, color: "#5AB8FF", label: `내 위치${myPlace.name && myPlace.name !== "내 위치" ? " · " + myPlace.name : ""}` } : null,
    { ...dest, color: "#F4C463", label: `가고싶은 위치 · ${dest.name}` },
  ];
  const poiMarkers = tab === "map" || tab === "nearby"
    ? [...sights, ...food].map((s) => ({ ...s, color: (SPOT_TYPES[s.type] || SPOT_TYPES.attraction).color, typeLabel: (SPOT_TYPES[s.type] || SPOT_TYPES.attraction).label }))
    : [];

  const sec = (key) => ({ display: tab === key ? "flex" : "none", flexDirection: "column", gap: 16 });

  return (
    <div style={{ minHeight: "100%", fontFamily: "'Noto Sans KR', sans-serif", background: "#FFFFFF", color: "#1A1F26" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Noto+Serif+KR:wght@700;900&family=Noto+Sans+KR:wght@400;500;700&display=swap');
        .sg { font-family: 'Space Grotesk', sans-serif; }
        .serif { font-family: 'Noto Serif KR', serif; }
        input { font-family: inherit; }
        ::placeholder { color: rgba(26,31,38,0.4); }
        ::-webkit-scrollbar { height: 4px; }
        .nav-btn { transition: transform 0.1s ease, background 0.15s ease; }
        .nav-btn:hover { background: rgba(15,23,31,0.16) !important; }
        .nav-btn:active { transform: scale(0.97); }
      `}</style>

      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <h1 className="serif" style={{ fontSize: 19, fontWeight: 900, margin: 0 }}>가족여행</h1>
      </div>

      <LocationBar myPlace={myPlace} setMyPlace={setMyPlace} dest={dest} setDest={setDest} />

      <div style={{ padding: "14px 20px 90px", maxWidth: 560, margin: "0 auto" }}>
        {/* 지도 탭 */}
        <div style={sec("map")}>
          <SectionCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div className="serif" style={{ fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={16} color="#1A1F26" /> 지도
              </div>
              <button
                onClick={() => setMapFullscreen(true)}
                style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(15,23,31,0.06)", border: "1px solid rgba(15,23,31,0.12)", borderRadius: 8, padding: "5px 9px", fontSize: 11.5, fontWeight: 700, color: "#1A1F26", cursor: "pointer" }}
              >
                <Maximize2 size={12} /> 전체화면
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <LeafletMap markers={markers} route={route} routeColor={routeColor} poiMarkers={poiMarkers} height={240} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 10, fontSize: 11 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5AB8FF", display: "inline-block" }} />내 위치</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F4C463", display: "inline-block" }} />{dest.name}</span>
            </div>

            {myPlace && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(15,23,31,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10 }}>
                  {Object.entries(ROUTE_PROFILES).map(([key, p]) => (
                    <button key={key} onClick={() => setMode(key)}
                      style={{ background: mode === key ? p.color : "rgba(15,23,31,0.08)", color: mode === key ? "#062024" : "#1A1F26", border: "none", borderRadius: 14, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {p.label}
                    </button>
                  ))}
                </div>
                {routeLoading && <div style={{ textAlign: "center", fontSize: 12, opacity: 0.6, padding: "6px 0" }}><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> 경로 계산 중...</div>}
                {!routeLoading && routeError && <div style={{ textAlign: "center", fontSize: 12, opacity: 0.6, padding: "6px 0" }}>{routeError}</div>}
                {!routeLoading && info && (
                  <div style={{ textAlign: "center", fontSize: 13, marginBottom: 12 }}>
                    <span className="sg" style={{ fontWeight: 700 }}>{info.distanceKm.toFixed(1)}km</span>
                    <span style={{ opacity: 0.5 }}> · </span>
                    <span className="sg" style={{ fontWeight: 700 }}>{fmtDuration(info.durationSec)}</span>
                    <span style={{ opacity: 0.5 }}> ({ROUTE_PROFILES[mode].label} 기준)</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ label: "카카오맵", url: kakaoUrl }, { label: "구글맵", url: googleUrl }, { label: "애플맵", url: appleUrl }].map((b) => (
                    <a key={b.label} href={b.url} target="_blank" rel="noopener noreferrer" className="nav-btn"
                      style={{ flex: 1, textAlign: "center", background: "rgba(15,23,31,0.1)", border: "1px solid rgba(15,23,31,0.25)", borderRadius: 10, padding: "9px 4px", fontSize: 12.5, fontWeight: 700, color: "#1A1F26", textDecoration: "none" }}>
                      {b.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {!myPlace && (
              <div style={{ textAlign: "center", fontSize: 11.5, opacity: 0.5, marginTop: 12 }}>내 위치를 설정하면 경로와 길찾기가 나타나요</div>
            )}
          </SectionCard>
        </div>

        {/* 날씨 탭 */}
        <div style={sec("weather")}>
          <SectionCard accent="#5AB8FF">
            <div className="serif" style={{ fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Navigation size={15} color="#5AB8FF" /> 내 위치 날씨
            </div>
            {myPlace ? <WeatherBlock lat={myPlace.lat} lon={myPlace.lon} /> : (
              <div style={{ textAlign: "center", fontSize: 12.5, opacity: 0.7, padding: "16px 0" }}>상단에서 내 위치를 먼저 설정해주세요</div>
            )}
          </SectionCard>
          <SectionCard accent="#F4C463">
            <div className="serif" style={{ fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <MapPin size={15} color="#F4C463" /> {dest.name} 날씨
            </div>
            <WeatherBlock lat={dest.lat} lon={dest.lon} />
          </SectionCard>
        </div>

        {/* 물때 탭 */}
        <div style={sec("tide")}>
          <SectionCard accent="#4FD6C0">
            <div className="serif" style={{ fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Anchor size={15} color="#4FD6C0" /> {dest.name} 물때
            </div>
            <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 8 }}>
              가장 가까운 조위관측소: {nearestStation.name} (약 {nearestKm.toFixed(0)}km)
            </div>
            <TideBlock station={nearestStation} />
          </SectionCard>
        </div>

        {/* 주변 탭 */}
        <div style={sec("nearby")}>
          <PlaceListCard title="핫플" icon={MapPin} accent="#C792EA" dest={dest} items={sights} loading={placesLoading} error={placesError} emptyText="반경 5km 안에서 등록된 장소를 찾지 못했어요." />
          <PlaceListCard title="맛집" icon={Utensils} accent="#FF7A59" dest={dest} items={food} loading={placesLoading || kakaoFoodLoading} error={placesError} emptyText="반경 5km 안에서 등록된 음식점을 찾지 못했어요." sourceNote={foodSource === "kakao" ? "카카오맵 제공" : "OpenStreetMap 제공"} />
        </div>
      </div>

      {mapFullscreen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#fff" }}>
          <LeafletMap markers={markers} route={route} routeColor={routeColor} poiMarkers={poiMarkers} height="100vh" />
          <button
            onClick={() => setMapFullscreen(false)}
            style={{
              position: "absolute", top: 16, right: 16, zIndex: 210,
              width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.96)",
              border: "1px solid rgba(15,23,31,0.15)", boxShadow: "0 4px 14px rgba(15,23,31,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
          >
            <X size={18} color="#1A1F26" />
          </button>
          <div style={{ position: "absolute", top: 16, left: 16, zIndex: 210, display: "flex", gap: 8, fontSize: 11 }}>
            <span style={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(15,23,31,0.12)", borderRadius: 8, padding: "5px 9px", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(15,23,31,0.1)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5AB8FF", display: "inline-block" }} />내 위치
            </span>
            <span style={{ background: "rgba(255,255,255,0.96)", border: "1px solid rgba(15,23,31,0.12)", borderRadius: 8, padding: "5px 9px", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(15,23,31,0.1)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F4C463", display: "inline-block" }} />{dest.name}
            </span>
          </div>
        </div>
      )}

      <TabBar active={tab} setActive={setTab} />

      <div style={{ textAlign: "center", fontSize: 9.5, opacity: 0.35, padding: "0 20px 90px" }}>
        날씨: Open-Meteo · 물때: 국립해양조사원(공공데이터포털) · 지도/핫플: OpenStreetMap · 경로: OSRM
      </div>
    </div>
  );
}
