# Implementation Hints: f2-optic-copy-product-lineup

> `/dev-feature`와 `/dev-run`에서 유지할 구현 힌트다. 실제 TASK SSOT는 `/dev-feature`가 생성할 `02-package` 문서다.

---

## 1. Copy Map Seed

| 영역 | 현재 단서 | 목표 방향 |
|---|---|---|
| Products section | `OPTIC Broker`, `OPTIC Shipper`, `OPTIC Carrier`, `OPTIC Operations`, `OPTIC Billing` | 현재 구현: `주선사용 운송 운영 콘솔` + `OPTIC Broker`, `화주용 운송 요청 포털` + `OPTIC Shipper`; 나머지는 구현 예정 |
| Problems section | 외부 플랫폼, 카카오 맵, 반복 입력 등 개별 문제 | 수작업 감소, 전송 누락 방지, 정산 누락 방지 중심 |
| Features section | `주문 관리`, `세금계산서`, `AI 주문 추출`, provider명 포함 설명 | AI 오더 등록, 업무 결과, 정산/증빙 연결 중심 |
| Integrations section | `Google Gemini AI`, `카카오 맵`, `팝빌`, `로지스엠/화물맨` | `화물맨` 외 provider명은 일반 기능명으로 낮춤 |
| Hero CTA | `데모 보기` 잔존 | 구조 변경 없이 copy map에서 유지/수정 여부 결정 |

---

## 2. Product Display Contract

제품 카드나 탭이 유지된다면 표시 정보는 아래 순서를 따른다.

| 표시 순서 | Broker | Shipper |
|---|---|---|
| 1차 제목 | 주선사용 운송 운영 콘솔 | 화주용 운송 요청 포털 |
| 보조 라벨 | `OPTIC Broker` | `OPTIC Shipper` |
| 대상 | 주선사 | 화주 |
| 설명 | 오더 접수, 배차, 화물맨 연동, 정산 흐름을 주선사 업무 방식에 맞춰 관리합니다. | 화주별 요청 양식과 진행 확인 방식을 맞춰, 운송 의뢰부터 상태 확인까지 한 흐름으로 정리합니다. |
| 상태 | 구현 대상 | 구현 대상 |

구현 예정 제품은 활성 탭처럼 보이지 않게 분리한다. 필요하면 roadmap strip, muted card, 작은 badge 등으로 낮춘다.

| 구현 예정 | 보조 라벨 | 표시 방향 |
|---|---|---|
| 운송사용 배차 수행 도구 | `OPTIC Carrier` | 구현 예정 |
| 운영 조율 콘솔 | `OPTIC Ops` | 구현 예정 |
| 정산 관리 도구 | `OPTIC Billing` | 구현 예정 |

---

## 3. Suggested Test Targets

| 테스트 | 목적 |
|---|---|
| constants test | 제품 데이터가 한글 역할명 + 영문 보조 라벨을 가진다. |
| products render test | Broker/Shipper는 구현 대상, Carrier/Ops/Billing은 구현 예정으로 보인다. |
| copy scan test 또는 script | 금지 문구와 외부 provider명이 customer-facing copy에 남지 않는다. |
| hero/header/footer smoke test | F1의 `OPTIC` 브랜드와 CTA 기준이 깨지지 않는다. |

---

## 4. Verification Commands

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

문구 스캔은 `rg`가 막히면 PowerShell `Select-String`을 사용한다.

```powershell
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern 'Optic Cargo','서비스 테스트','테스트 서버','데모 테스트'
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern 'Google Gemini AI','카카오 맵','팝빌','로지스엠'
Select-String -Path 'src\**\*.ts','src\**\*.tsx' -Pattern '주선사용 운송 운영 콘솔','화주용 운송 요청 포털','OPTIC Broker','OPTIC Shipper'
```

---

## 5. Guardrails

- `src/components/dashboard-preview/**`는 F2 구현 대상이 아니다.
- `package.json`에 새 dependency를 추가하지 않는다.
- 외부 provider명을 지우기 위해 내부 key까지 무리하게 바꾸지 않는다.
- `화물맨` 표기는 유지하되 `로지스엠/화물맨`처럼 두 브랜드가 함께 전면 노출되는 표현은 구현 단계에서 재검토한다.
- 긴 한글 제목은 모바일에서 줄바꿈과 버튼 폭을 반드시 확인한다.
