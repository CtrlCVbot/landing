# 08. Dev Tasks - F1 브랜드, 로고, CTA 최소 반영

> SSOT for `/dev-run` execution.
> TASK ID: `T-BRAND-{NN}`.

---

## 1. Task Status

| TASK | 제목 | 상태 | 주요 파일 | 검증 |
|---|---|:---:|---|---|
| T-BRAND-01 | 브랜드/CTA 상수 정리 | done | `src/lib/constants.ts`, `src/__tests__/lib/constants.test.ts` | pass |
| T-BRAND-02 | Header desktop/mobile CTA 분리 | done | `src/components/sections/header.tsx`, `src/components/sections/__tests__/header.test.tsx` | pass |
| T-BRAND-03 | Footer/Logo 기준 유지 | done | `src/components/sections/footer.tsx`, `src/components/icons/optic-logo.tsx`, `src/components/sections/__tests__/footer.test.tsx` | pass |
| T-BRAND-04 | 검증과 responsive evidence | done | `03-dev-notes/dev-output-summary.md`, `output/playwright/f1-brand-qa-summary.json` | pass |

## 2. T-BRAND-01 - 브랜드/CTA 상수 정리

**REQ**: REQ-BRAND-001, REQ-BRAND-003, REQ-BRAND-004

### Edit Scope

```txt
src/lib/constants.ts
src/__tests__/lib/constants.test.ts
```

### Acceptance

- [x] `OPTIC` 주 브랜드 상수 존재
- [x] `OPTICS` 보조 브랜드 상수 존재
- [x] `https://mm-broker-test.vercel.app/` 서비스 URL 상수 존재
- [x] `OPTIC 바로가기`, `도입 문의하기` label 상수 존재
- [x] constants test 통과

## 3. T-BRAND-02 - Header desktop/mobile CTA 분리

**REQ**: REQ-BRAND-002, REQ-BRAND-003, REQ-BRAND-004, REQ-BRAND-005, REQ-BRAND-006

### Edit Scope

```txt
src/components/sections/header.tsx
src/components/sections/__tests__/header.test.tsx
```

### Acceptance

- [x] desktop header에 `OPTIC 바로가기`가 보인다
- [x] desktop header에 `도입 문의하기`가 유지된다
- [x] `OPTIC 바로가기`는 서비스 URL, `target="_blank"`, `rel="noopener noreferrer"`를 가진다
- [x] mobile menu open 상태에서 두 CTA가 모두 보인다
- [x] mobile menu CTA click 후 menu가 닫힌다

## 4. T-BRAND-03 - Footer/Logo 기준 유지

**REQ**: REQ-BRAND-007, REQ-BRAND-008

### Edit Scope

```txt
src/components/sections/footer.tsx
src/components/icons/optic-logo.tsx
src/components/sections/__tests__/footer.test.tsx
```

### Acceptance

- [x] footer 주 브랜드는 `OPTIC`
- [x] `Powered by OPTICS`는 보조 표기로 유지
- [x] logo 접근성 이름이 유지된다
- [x] footer test 통과

## 5. T-BRAND-04 - 검증과 responsive evidence

**REQ**: REQ-BRAND-001 ~ REQ-BRAND-008

### Verification

```bash
pnpm test -- constants.test.ts header.test.tsx footer.test.tsx
pnpm typecheck
pnpm build
```

### Manual Checks

- [x] 1440px desktop header CTA 확인
- [x] 768px tablet header CTA 확인
- [x] 375px mobile menu CTA 겹침 없음
- [x] 서비스 URL 공개 가능성 확인 결과 기록

## 6. Execution Order

1. T-BRAND-01 Red-Green
2. T-BRAND-02 Red-Green
3. T-BRAND-03 Red-Green
4. T-BRAND-04 verification
