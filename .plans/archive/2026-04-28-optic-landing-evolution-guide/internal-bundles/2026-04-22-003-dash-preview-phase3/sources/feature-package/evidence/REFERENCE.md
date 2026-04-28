# dash-preview-phase3 — Reference Replication Covenant

> Hybrid reference-only 모드. 운영 URL 없음. 원본은 소스 코드 직접 참조.
> 생성: 2026-04-17 (`/copy-reference-refresh` Hybrid reference-only 실행)

---

## 원본 경로

```
.references/code/mm-broker/app/broker/order/ai-register/
```

- Git submodule SHA (동결): `bcb763100613c41a5bd3d2ff4405b4bb373426dc`
- 동결일: 2026-04-17

---

## 복제 철학

### 원칙: Dumb Components + DOM 1:1

| 항목 | 원본 mm-broker | landing 복제본 |
|------|--------------|--------------|
| DOM 구조 | 실제 제품 구조 | **동일** (1:1 재현) |
| 시각 스타일 | Tailwind/shadcn | **동일** |
| Zustand 스토어 | `useOrderRegisterStore` 등 | props 주입으로 대체 |
| React Hook Form | `useForm<IOrderRegisterData>()` | 정적 값으로 대체 |
| API Client | `/api/ai/extract-order` 등 | mock 데이터로 대체 |
| next/navigation | 라우터 파라미터 | 제거 |
| Dialog 포털 | AlertDialog, Dialog | 닫힌 상태 시각만 |
| 조작감 레이어 | 없음 | landing 전용 추가 (10종) |

### landing 전용 신규 파일 (원본에 독립 파일 없음)

아래 3개 파일은 원본 `.references`에 독립 파일이 존재하지 않으며,
Phase 1 스펙(IMP-DASH-001-option-b-spec-phase1.md) §3/§5에서 landing 전용으로 정의된 파일이다.
원본의 해당 기능을 담은 인라인 코드를 추출하여 별도 컴포넌트로 생성한다.

| 파일 | 원본 추출 위치 |
|------|-------------|
| `ai-tab-bar.tsx` | `ai-panel.tsx` 내 탭 전환 UI |
| `ai-extract-button.tsx` | `ai-panel.tsx` 내 추출 버튼 UI |
| `settlement-section.tsx` | `register-form.tsx` 내 정산 영역 UI |

---

## 복제 대상 파일 목록

### AiPanel (8개)

| # | 원본 경로 | landing 경로 | 원본 존재 |
|---|----------|-------------|:-------:|
| 1 | `_components/ai-panel.tsx` | `ai-register-main/ai-panel/index.tsx` | O |
| 2 | `_components/ai-input-area.tsx` | `ai-register-main/ai-panel/ai-input-area.tsx` | O |
| 3 | `_components/ai-result-buttons.tsx` | `ai-register-main/ai-panel/ai-result-buttons.tsx` | O |
| 4 | `_components/ai-button-item.tsx` | `ai-register-main/ai-panel/ai-button-item.tsx` | O |
| 5 | `_components/ai-warning-badges.tsx` | `ai-register-main/ai-panel/ai-warning-badges.tsx` | O |
| 6 | `_components/ai-extract-json-viewer.tsx` | `ai-register-main/ai-panel/ai-extract-json-viewer.tsx` | O |
| 7 | (없음 — landing 전용) | `ai-register-main/ai-panel/ai-tab-bar.tsx` | X |
| 8 | (없음 — landing 전용) | `ai-register-main/ai-panel/ai-extract-button.tsx` | X |

### OrderForm (9개)

| # | 원본 경로 | landing 경로 | 원본 존재 |
|---|----------|-------------|:-------:|
| 1 | `_components/register-form.tsx` | `ai-register-main/order-form/index.tsx` | O |
| 2 | `_components/company-manager-section.tsx` | `ai-register-main/order-form/company-manager-section.tsx` | O |
| 3 | `_components/company-manager-form.tsx` | `ai-register-main/order-form/company-manager-form.tsx` | O |
| 4 | `_components/company-manager-list.tsx` | `ai-register-main/order-form/company-manager-list.tsx` | O |
| 5 | `_components/company-warning.tsx` | `ai-register-main/order-form/company-warning.tsx` | O |
| 6 | `_components/location-form.tsx` | `ai-register-main/order-form/location-form.tsx` | O |
| 7 | `_components/datetime/datetime-card.tsx` | `ai-register-main/order-form/datetime-card.tsx` | O |
| 7a | `_components/datetime/pickup-datetime-card.tsx` | `ai-register-main/order-form/pickup-datetime-card.tsx` | O |
| 7b | `_components/datetime/dropoff-datetime-card.tsx` | `ai-register-main/order-form/dropoff-datetime-card.tsx` | O |
| 8 | `_components/transport-option-card.tsx` | `ai-register-main/order-form/transport-option-card.tsx` | O |
| 8a | `_components/option-selector.tsx` | `ai-register-main/order-form/option-selector.tsx` | O |
| 9 | `_components/estimate-info-card.tsx` | `ai-register-main/order-form/estimate-info-card.tsx` | O |
| 10 | `_components/cargo-info-form.tsx` | `ai-register-main/order-form/cargo-info-form.tsx` | O |
| 11 | `_components/register-success-dialog.tsx` | `ai-register-main/order-form/register-success-dialog.tsx` | O |
| 12 | (없음 — landing 전용) | `ai-register-main/order-form/settlement-section.tsx` | X |

### Dialog 시각 스냅샷 (2개)

| # | 원본 경로 | landing 경로 | 원본 존재 |
|---|----------|-------------|:-------:|
| 1 | `_components/search-address-dialog.tsx` | `ai-register-main/order-form/search-address-dialog.tsx` | O |
| 2 | `_components/company-manager-dialog.tsx` | `ai-register-main/order-form/company-manager-dialog.tsx` | O |

### 제외 파일

| 파일 | 제외 이유 |
|------|---------|
| `_components/register-summary.tsx` | REQ-DASH3-006: Phase 3 범위 제외 |
| `_components/datetime/summary-card.tsx` | 시연 플로우에 불필요한 요약 카드 |

---

## Drift 감지 방식

Phase 1 스펙 §12 R3 및 PRD §7-3 원본 drift 관리 기준:

1. **Git SHA 고정**: manifest.json의 `git_sha_frozen_at` 값을 기준으로 이후 변경 여부 추적
2. **분기별 점검**: `git -C .references/code/mm-broker log --oneline {SHA}..HEAD -- app/broker/order/ai-register/` 로 변경 커밋 확인
3. **시각 diff**: 원본을 실제 빌드/렌더링한 스크린샷 vs landing 복제본 스크린샷 비교 (Phase 1 스펙 §16 정량 지표 95%+ 기준)
4. **grep 검증**: 복제본에서 `useOrderRegisterStore`, `react-hook-form`, `@tanstack/react-query`, `next/navigation`, `@/lib/api` import가 0건인지 확인 (REQ-DASH3-007)

---

## 향후 캡처 계획

실제 스크린샷 캡처는 본 단계에서 수행하지 않는다. 아래 트리거에 따라 수행한다.

| capture source | viewport | state | 트리거 |
|--------------|----------|-------|--------|
| spec | 1440 | INITIAL | Milestone 5 완료 후 |
| spec | 1440 | AI_INPUT | Milestone 5 완료 후 |
| spec | 1440 | AI_EXTRACT | Milestone 5 완료 후 |
| spec | 1440 | AI_APPLY | Milestone 5 완료 후 |
| spec | 1024 | AI_APPLY | Milestone 5 Tablet 검증 |
| current | 1440 | INITIAL | Milestone 2 완료 후 |
| current | 1440 | AI_INPUT | Milestone 2 완료 후 |
| current | 1440 | AI_EXTRACT | Milestone 3 완료 후 |
| current | 1440 | AI_APPLY | Milestone 3 완료 후 |
| current | 1024 | AI_APPLY | Milestone 5 |

---

## 일반 copy 워크플로우와의 차이점

| 항목 | 일반 copy | 본 Feature (Hybrid reference-only) |
|------|----------|--------------------------------------|
| 원본 위치 | 운영 URL | `.references/code/mm-broker/` 소스 코드 |
| `SITE_VARIANT` | 필수 | 해당 없음 (설정 금지) |
| `SITE_VARIANT_HOST_MAP` | 필수 | 해당 없음 (설정 금지) |
| 실제 스크린샷 캡처 | 즉시 수행 | Spike 또는 Milestone 5에서 수행 |
| `/copy-visual-review` | 사용 | 사용 안 함 (Phase 1 스펙을 spec source로 대체) |
| `/copy-interaction-review` | 사용 | 사용 안 함 |
| evidence pairing | live ↔ current | spec ↔ current (향후 구현 시) |

> 이 파일은 `/copy-reference-refresh` Hybrid reference-only 모드로 생성되었습니다.
> 변경 시 Phase 1 스펙 §3/§5를 SSOT로 참조하십시오.
