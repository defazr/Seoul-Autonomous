import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    // 검증용 두 번째 빌드 출력(NEXT_DIST_DIR=.next-check) — 린트 대상 아님 (10-18: 빠뜨리면 13,000건 경고가 쏟아진다)
    ".next-check/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 벤더 워커(압축 파일 · maplibre) — 린트 대상 아님
    "public/vendor/**",
  ]),
]);

export default eslintConfig;
