# Dev Verification Report - F1 브랜드, 로고, CTA 최소 반영

> `/dev-verify .plans/features/active/f1-optic-brand-cta/` fresh verification 결과.

---

## 0. Verdict

| 항목 | 상태 | 메모 |
|---|:---:|---|
| 전체 판정 | PASS with WARN | 기능 검증은 통과, 기존 dashboard-preview 경고는 범위 외로 기록 |
| Verified SHA | pass | `b13f1a5c2a33e0800d70a6009bc5933c9cf6283f` |
| 검증일 | pass | 2026-04-28 17:01:42 +09:00 |
| 검증 범위 | pass | F1 브랜드/CTA 구현 커밋과 문서 패키지 |

`/plan-archive f1-optic-brand-cta` 진행 가능하다.

---

## 1. Fresh Verification Evidence

| 검증 | 결과 | 증거 |
|---|:---:|---|
| `git status --short --untracked-files=all` | pass | 검증 시작 전 tracked/untracked 변경 없음 |
| `pnpm test -- constants.test.ts header.test.tsx footer.test.tsx` | pass | 3 files, 6 tests |
| `pnpm test` | pass | 49 files, 1100 tests |
| `pnpm typecheck` | pass | `tsc --noEmit` 0 errors |
| `pnpm lint` | pass with WARN | 기존 dashboard-preview warnings 6건 |
| `pnpm build` | pass with WARN | production build 성공, 기존 lint warnings 재노출 |
| `git diff --check` | pass | whitespace error 없음 |
| Forbidden path check | pass | dashboard-preview, mock-data, preview-steps, globals.css, package files 변경 없음 |
| Local URL | pass | `http://localhost:3102/` 200 |
| Service URL | pass | `https://mm-broker-test.vercel.app/` 200 |

## 2. Browser QA

| Viewport | 결과 | 확인 내용 |
|---|:---:|---|
| 1440px desktop | pass | header `OPTIC 바로가기`, `도입 문의하기` visible, CTA 겹침 없음 |
| 768px tablet | pass | header CTA 2종 visible, CTA 겹침 없음 |
| 375px mobile | pass | menu open 후 CTA 2종 visible, `도입 문의하기` click 시 menu close |

Browser QA 세부 결과는 `output/playwright/f1-brand-dev-verify-summary.json`에 기록했다.

### Link Attribute Checks

| 항목 | 결과 |
|---|---|
| `OPTIC 바로가기` href | `https://mm-broker-test.vercel.app/` |
| `OPTIC 바로가기` target | `_blank` |
| `OPTIC 바로가기` rel | `noopener noreferrer` |
| `도입 문의하기` href | `#contact` |
| Browser console/page error | 0건 |

## 3. Requirements Coverage

| 요구사항 | 상태 | 근거 |
|---|:---:|---|
| 주 브랜드 `OPTIC` 노출 | pass | Header/Footer/Logo 상수 참조 및 tests 통과 |
| `OPTICS` 보조 표기 제한 | pass | Footer `Powered by OPTICS` 유지, tests 통과 |
| 서비스 CTA 새 탭 링크 | pass | test + browser QA에서 href/target/rel 확인 |
| 문의 CTA 유지 | pass | desktop/mobile 모두 `도입 문의하기` 유지 |
| 모바일 menu CTA 분리 | pass | 375px browser QA에서 두 CTA visible + overlap 0 |
| 내부 검증성 문구 미추가 | pass | `서비스 테스트` 문구를 새로 추가하지 않음 |
| DashboardPreview 범위 보호 | pass | forbidden path check empty |

## 4. Warnings and Non-Blocking Notes

| 항목 | Severity | Confidence | Action | 메모 |
|---|---|---|---|---|
| 기존 lint warnings | low | confirmed | queued | `_groupId`, `_rest`, `use-focus-walk` dependency 경고. F1 변경 범위 밖 |
| 기존 React `act(...)` warnings | low | confirmed | queued | dashboard-preview a11y tests의 기존 stderr. 전체 test는 pass |
| dev server 재시작 | low | confirmed | auto-fixed | `pnpm build` 후 `.next`가 production 산출물로 바뀌어 기존 dev server가 500 반환. 검증용 server 재시작 후 200 확인 |

## 5. Remaining Risk

| 리스크 | 수준 | 대응 |
|---|---|---|
| 로고 asset 최종 승인 | medium | F5 release gate에서 처리 |
| 서비스 URL production 전환 | low | 현재 URL 200 확인. 공식 도메인 전환은 Epic 후속 범위 |

## 6. Next Gate

| 항목 | 상태 | 메모 |
|---|:---:|---|
| Post-verify logo weight adjustment | pass | `03a8f1d`에서 OPTIC 텍스트 로고 두께를 `900`으로 조정 |
| Targeted tests | pass | `pnpm test -- header.test.tsx footer.test.tsx` |
| Typecheck | pass | `pnpm typecheck` |
| Lint | pass with WARN | 기존 dashboard-preview warnings만 재노출 |

## 7. Next Gate

1. F2 IDEA 등록 전, F1의 `BRAND`/`CTA_LINKS` 상수를 카피 기준점으로 참조한다.
2. F5에서 로고 이미지/자산 최종 승인과 메타데이터 검증을 이어간다.
