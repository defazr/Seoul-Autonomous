#!/usr/bin/env python3
"""
R1 — N버스(올빼미버스)·공항 심야버스 SSoT 생성기 (표준 라이브러리만 사용).

입력 1: 서울열린데이터광장 OA-1095 「서울시버스노선별정류소정보(YYYYMMDD).xlsx」
        (공공누리 1유형 · 출처표시 · 상업적 이용 및 변경 가능)
입력 2: 서울특별시 「심야 전용 시내버스(올빼미버스) 운행」 공식 운행표 (아래 OFFICIAL_SCHEDULE 상수)
        https://news.seoul.go.kr/traffic/archives/27974 (수정일 2026-03-20)
출력:   web/data/night-bus-routes.json  — 원본 무가공 수치 + 출처. 파생 계산(반환점·그룹·허브)은 validator/graph 층에서 한다.

사용:   python3 -I scripts/import-night-bus-routes.py <xlsx 경로> <출력 json 경로>
"""
import sys, zipfile, json, re, collections, datetime
import xml.etree.ElementTree as ET

OFFICIAL_SOURCE = {
    "title": "심야 전용 시내버스(올빼미버스) 운행",
    "url": "https://news.seoul.go.kr/traffic/archives/27974",
    "publisher": "서울특별시 교통기획관 버스정책과",
    "revisedOn": "2026-03-20",
    "license": "공공누리 제4유형 (출처표시 + 상업적 이용금지 + 변경금지) — 페이지 저작물의 조건. 여기서는 운행표의 사실 수치(첫·막차·배차·대수·거리)만 인용하며 문장·이미지는 복제하지 않는다. 사실 수치의 저작권 비보호 여부는 법적 확인이 없으므로 '미확인'으로 두고, 1유형 대체 출처가 확보되면 교체한다 (R1 문서 §2·§6)",
}
# 노선번호: (기·종점, 운행대수, 운행거리km, 배차간격, 첫차~막차)
OFFICIAL_SCHEDULE = {
    "N13": ("상계동~장지동", 12, 74.5, "20~30분", "23:30~03:40"),
    "N15": ("우이동~사당역", 13, 76.0, "15~30분", "23:30~03:30"),
    "N16": ("도봉산~온수동", 12, 76.1, "20~30분", "23:50~03:45"),
    "N26": ("방화동~신내동", 10, 72.3, "20~25분", "00:00~03:25"),
    "N30": ("강일동~서울역", 4, 45.5, "30~35분", "23:10~03:50"),
    "N31": ("강일동~정릉동", 8, 73.7, "35~40분", "23:30~03:50"),
    "N37": ("장지동~진관동", 8, 69.0, "25~30분", "00:00~03:10"),
    "N51": ("시흥동~하계동", 8, 77.4, "30분", "23:40~03:45"),
    "N61": ("신정동~상계동", 16, 90.0, "10~30분", "23:40~04:10"),
    "N62": ("신정동~면목동", 12, 72.3, "15~20분", "23:40~03:10"),
    "N64": ("개화동~염곡동", 8, 70.3, "30~35분", "23:40~03:15"),
    "N72": ("수색동~신내동", 9, 70.0, "30~40분", "23:30~03:45"),
    "N73": ("구산동~장지동", 8, 76.0, "35분", "23:30~03:35"),
    "N75": ("진관동~신림동", 12, 88.2, "25~30분", "23:30~03:50"),
}
# 기존 노선도(app/[locale]/night-bus-map/night-bus-data.ts ROUTE_COLORS) 승계
ROUTE_COLORS = {
    "N13": "#C9C23B", "N15": "#3FB8AE", "N16": "#E64134", "N26": "#7A3C8B", "N30": "#6E4A2C",
    "N31": "#C07BC0", "N37": "#E84C97", "N51": "#B07A45", "N61": "#3D6B33", "N62": "#ED8B3A",
    "N64": "#4274BB", "N72": "#1E1E1E", "N73": "#8CC15F", "N75": "#3B2E80",
}
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

def read_rows(path):
    z = zipfile.ZipFile(path)
    ss = []
    if "xl/sharedStrings.xml" in z.namelist():  # 공유 문자열 테이블이 없는 파일도 허용 (inlineStr 전용)
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
            ss.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])))
    header, rows = None, []
    with z.open("xl/worksheets/sheet1.xml") as f:
        for _, el in ET.iterparse(f, events=("end",)):
            if el.tag != "{%s}row" % NS["m"]:
                continue
            cells = {}
            for c in el.findall("m:c", NS):
                col = re.match(r"[A-Z]+", c.get("r")).group(0)
                t = c.get("t")
                if t == "inlineStr":  # OOXML 변형: 셀 내 인라인 문자열
                    val = "".join(x.text or "" for x in c.iter("{%s}t" % NS["m"]))
                else:
                    v = c.find("m:v", NS)
                    val = v.text if v is not None else ""
                    if t == "s":
                        val = ss[int(val)]
                cells[col] = val
            vals = [cells.get(k, "") for k in "ABCDEFGH"]
            if header is None:
                header = vals
            else:
                rows.append(vals)
            el.clear()
    expected = ["ROUTE_ID", "노선명", "순번", "NODE_ID", "ARS_ID", "정류소명", "X좌표", "Y좌표"]
    if header != expected:
        raise SystemExit(f"BLOCK: 헤더가 기대와 다름 {header}")
    return rows

def normalize_ars(raw):
    """ARS 는 5자리 문자열. 숫자형(1234.0 / 1.234E3)으로 저장된 셀도 '01234' 로 복원한다. 복원 불가면 BLOCK."""
    raw = (raw or "").strip()
    if raw == "":
        return ""
    if re.fullmatch(r"\d{1,5}", raw):
        return raw.zfill(5)
    try:
        n = int(float(raw))
    except ValueError:
        raise SystemExit(f"BLOCK: ARS 형식 불명 {raw!r}")
    if n < 0 or n > 99999:
        raise SystemExit(f"BLOCK: ARS 범위 밖 {raw!r}")
    return str(n).zfill(5)

def classify(name):
    """올빼미 14 = 공식 운행표 목록. 공항 심야 = N6xxx 4자리. 그 외 N* 는 분류 불명 → 생성 중단 (조용히 공항으로 넣지 않는다)."""
    if name in OFFICIAL_SCHEDULE:
        return "owl"
    if re.fullmatch(r"N6\d{3}", name):
        return "airport-night"
    raise SystemExit(f"BLOCK: 분류 불명 노선 {name!r} — OFFICIAL_SCHEDULE 또는 공항 규칙(N6xxx)을 갱신할 것")

def main():
    xlsx, out = sys.argv[1], sys.argv[2]
    m = re.search(r"(\d{8})", xlsx)
    snapshot = f"{m.group(1)[:4]}-{m.group(1)[4:6]}-{m.group(1)[6:]}" if m else None
    rows = read_rows(xlsx)
    by_route = collections.defaultdict(list)
    names = {}
    for route_id, name, seq, node, ars, stop, x, y in rows:
        if not re.match(r"^N\d", name):
            continue
        names[route_id] = name
        by_route[route_id].append({
            "seq": int(float(seq)),
            "arsId": normalize_ars(ars),
            "nodeId": node,
            "nameKo": stop,
            "lon": round(float(x), 7),
            "lat": round(float(y), 7),
        })
    routes = []
    for route_id, stops in by_route.items():
        name = names[route_id]
        stops.sort(key=lambda s: s["seq"])
        category = classify(name)
        is_owl = category == "owl"
        entry = {
            "id": name.lower(),
            "no": name,
            "busRouteId": route_id,
            "category": category,
            "color": ROUTE_COLORS.get(name),
            "stopCount": len(stops),
            "stops": stops,
        }
        if is_owl:
            ends, veh, km, headway, first_last = OFFICIAL_SCHEDULE[name]
            first, last = first_last.split("~")
            entry["official"] = {
                "ends": ends.split("~"),
                "vehicles": veh,
                "distanceKm": km,
                "headway": headway,
                "firstBus": first,
                "lastBus": last,
                "source": OFFICIAL_SOURCE["url"],
                "asOf": OFFICIAL_SOURCE["revisedOn"],
            }
        routes.append(entry)
    routes.sort(key=lambda r: (r["category"] != "owl", len(r["no"]), r["no"]))
    doc = {
        "_meta": {
            "generatedBy": "web/scripts/import-night-bus-routes.py",
            "generatedOn": datetime.date.today().isoformat(),
            "stopsSource": {
                "dataset": "서울시 버스 노선 정보 조회 (OA-1095) — 서울시버스노선별정류소정보",
                "url": "https://data.seoul.go.kr/dataList/OA-1095/S/1/datasetView.do",
                "snapshot": snapshot,
                "license": "공공누리 1유형 (출처표시 · 상업적 이용 및 변경 가능)",
                "crs": "WGS84 (lon, lat)",
            },
            "scheduleSource": OFFICIAL_SOURCE,
            "rules": [
                "이 파일은 원본 수치의 무가공 사본이다. 반환점·방향·물리 그룹·허브는 파생 층에서 계산한다",
                "arsId 는 5자리 문자열 (앞자리 0 보존). nodeId 는 서울시 정류소 고유 ID",
                "official.* 은 서울시 운행표 사실 수치이며 날짜(asOf)와 함께만 표시한다",
                "공항 심야(N6xxx) 는 운행표 출처가 달라 official 블록이 없다 — 별도 공식 확인 전 운행시간 표시 금지",
            ],
        },
        "routes": routes,
    }
    json.dump(doc, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"routes={len(routes)} owl={sum(r['category']=='owl' for r in routes)} airport={sum(r['category']!='owl' for r in routes)} stops={sum(r['stopCount'] for r in routes)} → {out}")

if __name__ == "__main__":
    main()
