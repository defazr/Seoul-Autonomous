import { notFound } from 'next/navigation';

/** 없는 주소를 [locale] 레이아웃(헤더·푸터) 안의 not-found 로 보낸다 — 배포 전 점검 10-16 (정책 감사 BLOCK 3: 셸 없는 기본 404). */
export default function CatchAll() {
  notFound();
}
