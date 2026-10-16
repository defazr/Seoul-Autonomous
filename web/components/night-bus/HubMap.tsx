'use client';

import { useEffect, useRef } from 'react';
import { Map as MapLibreMap, AttributionControl, NavigationControl, Marker, Popup, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './HubMap.module.css';

export type HubMapProps = {
  center: [number, number];
  stops: { arsId: string; name: string; lon: number; lat: number }[];
  nearby: { arsId: string; name: string; lon: number; lat: number }[];
  /** 도로 형상 경로(R4 에서 서울시 노선경로 API 로 확보) — 지금은 그리지 않는다. */
  lines?: { no: string; color: string; coords: [number, number][] }[];
};

/** 실제 지도 — MapLibre GL + OpenFreeMap(dark) 벡터 타일. 키·쿠키·호출 한도 없음. 출처표기 필수. */
export default function HubMap({ center, stops, nearby }: HubMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    // 번들러가 maplibre 워커 URL 을 해석하지 못하므로 워커 모듈(dist/maplibre-gl-worker.mjs)을 public/vendor 에서 직접 제공한다 (버전 고정 · 업그레이드 시 교체).
    setWorkerUrl('/vendor/maplibre-gl-worker-6.14.0.mjs');
    const map = new MapLibreMap({ container: ref.current, style: 'https://tiles.openfreemap.org/styles/dark', center, zoom: 14.3, attributionControl: false, cooperativeGestures: true,
      // 지도 UI 문자열 한국어 (허브 페이지는 ko 전용 · 접근성 감사 F5)
      locale: { 'Map.Title': '지도', 'NavigationControl.ZoomIn': '확대', 'NavigationControl.ZoomOut': '축소', 'AttributionControl.ToggleAttribution': '출처 표시 열기/닫기', 'CooperativeGesturesHandler.WindowsHelpText': 'Ctrl 키를 누른 채 스크롤하면 지도가 확대·축소됩니다', 'CooperativeGesturesHandler.MacHelpText': '⌘ 키를 누른 채 스크롤하면 지도가 확대·축소됩니다', 'CooperativeGesturesHandler.MobileHelpText': '두 손가락으로 지도를 움직이세요' } });
    map.addControl(new AttributionControl({ compact: true, customAttribution: '정류소 위치·노선 경로: 서울시 공식 데이터' }), 'bottom-right');
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    const markers: Marker[] = [];
    map.on('load', () => {
      // 한국어 지명 우선 (OpenFreeMap 스타일은 라틴 표기를 앞에 둔다)
      for (const layer of map.getStyle().layers ?? []) {
        if (layer.type !== 'symbol' || !map.getLayoutProperty(layer.id, 'text-field')) continue;
        map.setLayoutProperty(layer.id, 'text-field', ['coalesce', ['get', 'name:ko'], ['get', 'name']]);
      }
      // 정류장 사이를 직선으로 잇는 선은 도로 형상이 아니라서 지저분하다(포그린 피드백 10-15). 실제 도로를 따르는 경로 좌표는 서울시 노선경로 API(키 필요 · R4)로 받은 뒤에만 그린다.
      map.addSource('nb-nearby', { type: 'geojson', data: { type: 'FeatureCollection', features: nearby.map((s) => ({ type: 'Feature', properties: { name: s.name, arsId: s.arsId }, geometry: { type: 'Point', coordinates: [s.lon, s.lat] } })) } });
      map.addLayer({ id: 'nb-nearby', type: 'circle', source: 'nb-nearby', paint: { 'circle-radius': 3.5, 'circle-color': '#0A0F1E', 'circle-stroke-color': '#8A93A8', 'circle-stroke-width': 1.5, 'circle-opacity': 0.9 } });
      map.on('click', 'nb-nearby', (e) => { const f = e.features?.[0]; if (!f) return; new Popup({ offset: 8, closeButton: false }).setLngLat((f.geometry as GeoJSON.Point).coordinates as [number, number]).setText(`${f.properties.name} · ${f.properties.arsId}`).addTo(map); });
      map.on('mouseenter', 'nb-nearby', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'nb-nearby', () => { map.getCanvas().style.cursor = ''; });
      for (const s of stops) {
        const el = document.createElement('button'); el.type = 'button'; el.className = styles.marker; el.textContent = s.arsId; el.setAttribute('aria-label', `${s.name} ${s.arsId}`);
        markers.push(new Marker({ element: el, anchor: 'bottom' }).setLngLat([s.lon, s.lat]).setPopup(new Popup({ offset: 14, closeButton: false }).setText(`${s.name} · ${s.arsId}`)).addTo(map));
      }
    });
    return () => { markers.forEach((m) => m.remove()); map.remove(); };
  }, [center, stops, nearby]);
  return <div ref={ref} className={styles.map} role="region" aria-label="허브 주변 지도" />;
}
