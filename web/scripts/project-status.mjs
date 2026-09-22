#!/usr/bin/env node
/**
 * 세션 시작용 좌표 실측기.
 *
 *   cd web && node scripts/project-status.mjs
 *
 * **판단 파일이 아니다.** 매 실행마다 git 과 파일시스템에서 계산 가능한 객관적 사실만
 * 출력한다. 상태를 복제 저장하지 않으므로 낡을 수 없다.
 *
 * 하드코딩하지 않는 것 (SESSION-HANDOFF 가 유일한 SSoT):
 *   현재 판정 · gate · 다음 checkpoint 날짜 · 금지 작업 목록 · 제품 판단 · NEXT
 *   NEXT 를 일반 grep 으로 자동 추출하지도 않는다 — 과거 문서에 여러 NEXT 가 남아
 *   stale 값을 현재값으로 읽을 수 있기 때문이다.
 *
 * 기본 실행 금지: SSH · Production 조회 · GSC/GA4 호출 · 네트워크 일체.
 * 네트워크가 끊겨도 로컬 좌표는 정상 출력되어야 한다.
 *
 * 불일치는 표시하되 "작업 BLOCK" 같은 사람의 판단은 내리지 않는다. 실측과 판단은 분리한다.
 * 새 dependency 를 설치하지 않는다. Node 기본 기능만 쓴다.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const RT2_CODE_COMMIT = 'b10c7d3';   // RT-2 코드가 history 에 있는지 확인용 (판정 아님)

/**
 * stdout 을 **가공 없이** 돌려준다.
 * `git status --porcelain` 의 첫 두 칸은 staged/unstaged 를 구분하는 의미 있는 공백이므로
 * 전체 trim 을 걸면 첫 줄이 밀려 staged 로 오분류된다 (2026-09-14 실측 버그).
 */
const gitRaw = (...args) => {
  try {
    return execFileSync('git', ['-C', REPO, ...args], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    return null;
  }
};

/** 한 줄짜리 값 전용. 줄바꿈만 털어낸다. */
const git = (...args) => {
  const out = gitRaw(...args);
  return out === null ? null : out.trim();
};

const row = (label, value, flag = '') =>
  console.log(`  ${label.padEnd(26)} ${value}${flag ? `   ${flag}` : ''}`);

const notes = [];

console.log('=== 좌표 실측 (로컬 전용 · 네트워크 0) ===');
row('repository', REPO);

if (git('rev-parse', '--git-dir') === null) {
  console.log('\n  git 저장소가 아니거나 git 을 실행할 수 없다. 이후 항목을 계산하지 않는다.');
  process.exit(0);
}

const head = git('rev-parse', 'HEAD');
const origin = git('rev-parse', 'origin/main');
const branch = git('rev-parse', '--abbrev-ref', 'HEAD');

row('branch', branch ?? '-');
row('local HEAD', head ?? '-');
row('origin/main', origin ?? '(원격 ref 없음 — fetch 필요할 수 있음)');

if (head && origin) {
  const same = head === origin;
  row('HEAD == origin/main', same ? 'yes' : 'NO');
  if (!same) notes.push('HEAD 와 origin/main 이 다르다');

  const lr = git('rev-list', '--left-right', '--count', 'HEAD...origin/main');
  const [ahead, behind] = (lr ?? '? ?').split(/\s+/);
  row('ahead / behind', `${ahead} / ${behind}`);
  if (ahead !== '0' || behind !== '0') notes.push(`ahead/behind 가 0/0 이 아니다 (${ahead}/${behind})`);
}

const porcelain = (gitRaw('status', '--porcelain') ?? '')
  .split('\n')
  .map((l) => l.replace(/\r?$/, ''))
  .filter((l) => l.length >= 3);   // 두 칸 상태코드 + 공백 + 경로
const untracked = porcelain.filter((l) => l.startsWith('??'));
const staged = porcelain.filter((l) => l[0] !== ' ' && l[0] !== '?');
const unstaged = porcelain.filter((l) => l[1] !== ' ' && l[0] !== '?');

// 자기 검증 — porcelain 파싱 결과를 독립 명령과 대조한다.
// 2026-09-14 에 trim 으로 첫 줄이 staged 로 오분류된 적이 있어 같은 계열 버그를 막는다.
const countLines = (out) => (out ?? '').split('\n').filter(Boolean).length;
const truthUnstaged = countLines(gitRaw('diff', '--name-only'));
const truthStaged = countLines(gitRaw('diff', '--cached', '--name-only'));
if (unstaged.length !== truthUnstaged || staged.length !== truthStaged) {
  notes.push(`porcelain 파싱과 git diff 집계가 불일치한다 `
    + `(파싱 unstaged ${unstaged.length}/staged ${staged.length} vs `
    + `실제 ${truthUnstaged}/${truthStaged}) — 이 스크립트의 버그다`);
}

row('tracked 변경 (unstaged)', String(unstaged.length));
row('staged 변경', String(staged.length));
row('untracked', String(untracked.length));
for (const u of untracked) console.log(`${' '.repeat(31)}${u.slice(3)}`);

// RT-2 코드가 현재 history 에 포함되는지 — 포함 여부만 말하고 의미는 부여하지 않는다
const inHistory = git('merge-base', '--is-ancestor', RT2_CODE_COMMIT, 'HEAD') !== null;
row(`${RT2_CODE_COMMIT} in history`, inHistory ? 'yes' : 'NO');
if (!inHistory) notes.push(`${RT2_CODE_COMMIT} 가 현재 HEAD history 에 없다`);

console.log('\n=== 읽어야 할 문서 ===');
const HANDOFF = 'docs/SESSION-HANDOFF.md';
const handoffExists = existsSync(join(REPO, HANDOFF));
row('1. CC 세션 진입점 (단일 SSOT)', HANDOFF, handoffExists ? '' : '← 없음');
if (!handoffExists) notes.push(`${HANDOFF} 가 없다`);
console.log(`${' '.repeat(31)}현재 판정·gate·NEXT 는 전부 이 파일이 정본이다.`);
console.log(`${' '.repeat(31)}이어서 읽을 정본은 이 파일이 지목하는 것만 읽는다.`);

// ⚠ docs/handoff/HANDOFF-YYYYMMDD.md 는 **역사 자료**다.
// 파일명 사전순 최대를 "최신" 으로 안내하면, dated 파일을 만들지 않은 라운드가 생기는 순간
// 낡은 문서가 최신으로 승격돼 새 세션을 오도한다 (2026-09-22 예행에서 실제 적발).
// 따라서 진입점은 SESSION-HANDOFF 하나로 고정하고, dated 파일은 개수만 참고로 보고한다.
let archived = 0;
const hdir = join(REPO, 'docs', 'handoff');
if (existsSync(hdir)) {
  archived = readdirSync(hdir).filter((f) => /^HANDOFF-\d{8}(_\d+)?\.md$/.test(f)).length;
}
row('2. docs/handoff/ (역사 자료)', `${archived}건 보존`, '← 최신 아님 · 진입점 아님');

// SESSION-HANDOFF 가 가리키는 docs 경로가 실재하는지만 확인
const refSources = [handoffExists ? HANDOFF : null].filter(Boolean);
const refs = new Set();
for (const rel of refSources) {
  const text = readFileSync(join(REPO, rel), 'utf8');
  for (const m of text.matchAll(/docs\/[A-Za-z0-9_.\-/]+\.md/g)) {
    // 서식 예시(HANDOFF-YYYYMMDD.md 등)는 실제 참조가 아니므로 제외한다
    if (/YYYY|MMDD|<|>/.test(m[0])) continue;
    refs.add(m[0]);
  }
}
const missing = [...refs].filter((r) => !existsSync(join(REPO, r))).sort();
row('3. 참조 문서 실재 확인', `${refs.size - missing.length} / ${refs.size} 존재`);
for (const m of missing) console.log(`${' '.repeat(31)}없음: ${m}`);
if (missing.length) notes.push(`handoff 가 가리키는 문서 ${missing.length}건이 실재하지 않는다`);

console.log('\n=== 관측 도구 ===');
const tool = 'web/scripts/test-gsc-discovery.mjs';
row('discovery 관측 QA', existsSync(join(REPO, tool))
  ? `cd web && node scripts/test-gsc-discovery.mjs  (관측 전 먼저 실행)`
  : '(없음)');

console.log('\n=== 확인 필요 ===');
if (notes.length === 0) {
  console.log('  실측 항목에서 불일치 없음.');
} else {
  for (const n of notes) console.log(`  · ${n}`);
}
console.log(`
  위는 전부 실측값이다. 현재 판정·gate·다음 작업·금지 계약은 여기 없다.
  ${HANDOFF} 를 읽고, 거기가 가리키는 정본 문서로 이어간다.`);
