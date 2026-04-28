# 10. Release Checklist - F1 브랜드, 로고, CTA 최소 반영

---

## 1. Implementation Checklist

| 항목 | 상태 |
|---|:---:|
| 브랜드/CTA 상수 추가 | [x] |
| Header desktop `OPTIC 바로가기` 추가 | [x] |
| Header desktop `도입 문의하기` 유지 | [x] |
| Mobile menu 두 CTA 노출 | [x] |
| Mobile menu CTA click close 유지 | [x] |
| Footer `OPTIC` / `Powered by OPTICS` 유지 | [x] |
| Logo 접근성 이름 유지 | [x] |
| `서비스 테스트` 문구 미추가 | [x] |

## 2. Open Gate Checklist

| 항목 | 상태 | 메모 |
|---|:---:|---|
| 서비스 URL 공개 가능성 확인 | [x] | `https://mm-broker-test.vercel.app/` 응답 확인 |
| 로고 asset 최종 승인 deferred 기록 | [x] | F5 release gate |
| 모바일 375px CTA 겹침 확인 | [x] | `output/playwright/f1-brand-qa-summary.json` |

## 3. Forbidden Path Check

| 경로 | 기대 | 상태 |
|---|---|:---:|
| `src/components/dashboard-preview/**` | 변경 없음 | [x] |
| `src/lib/mock-data.ts` | 변경 없음 | [x] |
| `src/lib/preview-steps.ts` | 변경 없음 | [x] |
| `src/app/globals.css` | 변경 없음 | [x] |
| `package.json` / lockfile | 변경 없음 | [x] |

## 4. Automated Verification

| 명령 | 상태 | 메모 |
|---|:---:|---|
| `pnpm test -- constants.test.ts header.test.tsx footer.test.tsx` | [x] | targeted tests |
| `pnpm test` | [x] | 49 files, 1100 tests |
| `pnpm typecheck` | [x] | TypeScript |
| `pnpm lint` | [x] | 기존 dashboard-preview warnings 있음 |
| `pnpm build` | [x] | production build |

## 5. Browser QA

| 항목 | 상태 | Evidence |
|---|:---:|---|
| desktop 1440px header CTA | [x] | `output/playwright/f1-brand-desktop-1440.png` |
| tablet 768px header CTA | [x] | `output/playwright/f1-brand-tablet-768.png` |
| mobile 375px menu CTA | [x] | `output/playwright/f1-brand-mobile-375.png` |

## 6. Dev Verify

| 항목 | 상태 | Evidence |
|---|:---:|---|
| fresh `/dev-verify` 실행 | [x] | `03-dev-notes/dev-verification-report.md` |
| desktop/tablet/mobile browser QA 재확인 | [x] | `output/playwright/f1-brand-dev-verify-summary.json` |
| service URL 200 응답 재확인 | [x] | `https://mm-broker-test.vercel.app/` |
| archive gate 준비 | [x] | `/plan-archive f1-optic-brand-cta` |

## 7. Dev Notes

- [x] 서비스 URL 공개 가능성 확인 결과 기록
- [x] TASK별 결과가 `08-dev-tasks.md`에 갱신됨
- [x] 구현 요약이 `03-dev-notes/dev-output-summary.md`에 기록됨
- [x] `/dev-verify` fresh verification report가 `03-dev-notes/dev-verification-report.md`에 기록됨
