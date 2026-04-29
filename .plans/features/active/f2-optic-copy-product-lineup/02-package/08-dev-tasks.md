# 08. Dev Tasks - F2 카피와 제품 라인업 정리

> SSOT for `/dev-run` execution.
> TASK ID: `T-F2-{NN}`.

---

## 1. Task Status

| TASK | 제목 | 상태 | 주요 파일 | 검증 |
|---|---|:---:|---|---|
| T-F2-01 | constants copy/data 정리 | pending | `src/lib/constants.ts`, `src/__tests__/lib/constants.test.ts` | targeted test |
| T-F2-02 | Features/Problems/Integrations 카피 정리 | pending | `features.tsx`, `problems.tsx`, `integrations.tsx`, section tests | targeted test |
| T-F2-03 | Products 섹션 구조 정리 | pending | `products.tsx`, `constants.ts`, `products.test.tsx` | targeted test |
| T-F2-04 | Hero/Header/Footer 회귀 보정 | pending | `hero.tsx`, `header.tsx`, `footer.tsx`, existing tests | targeted test |
| T-F2-05 | 검증, 문구 스캔, responsive evidence | pending | test output, browser evidence | full checks |

## 2. T-F2-01 - constants copy/data 정리

**REQ**: REQ-F2-001, REQ-F2-002, REQ-F2-003, REQ-F2-004, REQ-F2-005, REQ-F2-006, REQ-F2-007, REQ-F2-008, REQ-F2-009, REQ-F2-011

### Edit Scope

```txt
src/lib/constants.ts
src/__tests__/lib/constants.test.ts
```

### Acceptance

- [ ] 금지 문구가 customer-facing constants에서 제거된다.
- [ ] Features 데이터에 `AI 오더 등록`, `화물맨 연동`, `정산 자동화`, `세금계산서 관리` 기준이 반영된다.
- [ ] `화물맨 연동` 설명은 배차 단계 문맥을 가진다.
- [ ] Products 데이터는 한글 역할명과 영문 보조 라벨을 분리한다.
- [ ] Carrier/Ops/Billing은 구현 예정 상태를 가진다.

## 3. T-F2-02 - Features/Problems/Integrations 카피 정리

**REQ**: REQ-F2-004, REQ-F2-005, REQ-F2-006, REQ-F2-009, REQ-F2-010, REQ-F2-011

### Edit Scope

```txt
src/components/sections/features.tsx
src/components/sections/problems.tsx
src/components/sections/integrations.tsx
src/components/sections/__tests__/features.test.tsx
src/components/sections/__tests__/integrations.test.tsx
```

### Acceptance

- [ ] Features 섹션은 업무 결과 중심 기능명을 렌더링한다.
- [ ] `화물맨 연동`은 배차 단계 기능으로 보인다.
- [ ] Problems 섹션은 수작업 감소, 전송 누락, 정산 누락 방지 중심으로 정리된다.
- [ ] Integrations 섹션은 provider명 나열보다 기능 결과를 먼저 말한다.

## 4. T-F2-03 - Products 섹션 구조 정리

**REQ**: REQ-F2-006, REQ-F2-007, REQ-F2-008, REQ-F2-014

### Edit Scope

```txt
src/lib/constants.ts
src/components/sections/products.tsx
src/components/sections/__tests__/products.test.tsx
```

### Acceptance

- [ ] `주선사용 운송 운영 콘솔`과 `화주용 운송 요청 포털`이 1차 제목으로 보인다.
- [ ] `OPTIC Broker`, `OPTIC Shipper`는 보조 라벨로 보인다.
- [ ] Carrier/Ops/Billing은 구현 예정으로 분리된다.
- [ ] 기존 tab UI를 유지하면 active tab은 Broker/Shipper만 사용한다.
- [ ] 모바일에서 긴 제목과 보조 라벨이 겹치지 않는다.

## 5. T-F2-04 - Hero/Header/Footer 회귀 보정

**REQ**: REQ-F2-001, REQ-F2-002, REQ-F2-003, REQ-F2-012

### Edit Scope

```txt
src/components/sections/hero.tsx
src/components/sections/header.tsx
src/components/sections/footer.tsx
src/components/sections/__tests__/hero.test.tsx
src/components/sections/__tests__/header.test.tsx
src/components/sections/__tests__/footer.test.tsx
```

### Acceptance

- [ ] F1의 `OPTIC` 브랜드와 CTA 기준이 깨지지 않는다.
- [ ] Hero에 내부 검증성 CTA 문구가 남는지 확인하고 필요 시 보정한다.
- [ ] Header/footer 기존 테스트가 유지된다.

## 6. T-F2-05 - 검증, 문구 스캔, responsive evidence

**REQ**: REQ-F2-001 ~ REQ-F2-014

### Verification

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

### Copy Scan

```powershell
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern 'Optic Cargo','서비스 테스트','테스트 서버','데모 테스트'
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern 'Google Gemini AI','카카오 맵','팝빌','로지스엠'
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern '화물맨 연동','배차','정산 자동화','세금계산서 관리'
```

### Manual Checks

- [ ] 1440px desktop 제품 섹션 확인
- [ ] 768px tablet 제품 섹션 확인
- [ ] 375px mobile 제품 카드와 기능 카드 텍스트 겹침 없음
- [ ] keyboard focus visible 확인

## 7. Execution Order

1. T-F2-01 Red-Green
2. T-F2-02 Red-Green
3. T-F2-03 Red-Green
4. T-F2-04 회귀 확인
5. T-F2-05 verification
