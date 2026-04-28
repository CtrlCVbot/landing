# 10. Release Checklist - F1 브랜드, 로고, CTA 최소 반영

---

## 1. Implementation Checklist

| 항목 | 상태 |
|---|:---:|
| 브랜드/CTA 상수 추가 | [ ] |
| Header desktop `OPTIC 바로가기` 추가 | [ ] |
| Header desktop `도입 문의하기` 유지 | [ ] |
| Mobile menu 두 CTA 노출 | [ ] |
| Mobile menu CTA click close 유지 | [ ] |
| Footer `OPTIC` / `Powered by OPTICS` 유지 | [ ] |
| Logo 접근성 이름 유지 | [ ] |
| `서비스 테스트` 문구 미추가 | [ ] |

## 2. Open Gate Checklist

| 항목 | 상태 | 메모 |
|---|:---:|---|
| 서비스 URL 공개 가능성 확인 | [ ] | `https://mm-broker-test.vercel.app/` |
| 로고 asset 최종 승인 deferred 기록 | [x] | F5 release gate |
| 모바일 375px CTA 겹침 확인 | [ ] | 구현 후 확인 |

## 3. Forbidden Path Check

| 경로 | 기대 | 상태 |
|---|---|:---:|
| `src/components/dashboard-preview/**` | 변경 없음 | [ ] |
| `src/lib/mock-data.ts` | 변경 없음 | [ ] |
| `src/lib/preview-steps.ts` | 변경 없음 | [ ] |
| `src/app/globals.css` | 변경 없음 | [ ] |
| `package.json` / lockfile | 변경 없음 | [ ] |

## 4. Automated Verification

| 명령 | 상태 | 메모 |
|---|:---:|---|
| `pnpm test -- constants.test.ts header.test.tsx footer.test.tsx` | [ ] | targeted tests |
| `pnpm typecheck` | [ ] | TypeScript |
| `pnpm build` | [ ] | production build |

## 5. Browser QA

| 항목 | 상태 | Evidence |
|---|:---:|---|
| desktop 1440px header CTA | [ ] | screenshot or note |
| tablet 768px transition | [ ] | screenshot or note |
| mobile 375px menu CTA | [ ] | screenshot or note |

## 6. Dev Notes

- [ ] 서비스 URL 공개 가능성 확인 결과 기록
- [ ] TASK별 결과가 `08-dev-tasks.md`에 갱신됨
- [ ] 구현 요약이 `03-dev-notes/dev-output-summary.md`에 기록됨
