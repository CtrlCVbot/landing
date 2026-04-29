# 02. UI Spec - F1 브랜드, 로고, CTA 최소 반영

---

## 1. Header Desktop

| 요소 | 기준 |
|---|---|
| Brand | 좌측 `OPTIC` 유지 |
| Navigation | 기존 `NAV_LINKS` 유지 |
| Service CTA | `OPTIC 바로가기`, 외부 링크, 새 탭 |
| Inquiry CTA | `도입 문의하기`, `#contact` anchor |
| ThemeToggle | 기존 위치 유지 |

### Layout Guidance

- `ThemeToggle`, `OPTIC 바로가기`, `도입 문의하기`가 한 action group에 들어간다.
- 두 CTA는 목적이 다른 버튼처럼 보여야 한다.
- 기존 header 높이 `h-16`과 navigation 구조를 유지한다.

## 2. Mobile Menu

| 요소 | 기준 |
|---|---|
| Menu trigger | 기존 햄버거 버튼 유지 |
| Menu links | 기존 navigation links 유지 |
| Service CTA | `OPTIC 바로가기` 렌더링, click close |
| Inquiry CTA | `도입 문의하기` 렌더링, click close |
| Close button | 기존 닫기 버튼 유지 |

### Mobile Guidance

- 두 CTA를 같은 스타일로 반복하지 말고 목적 차이가 보이게 한다.
- 375px viewport에서 버튼 text가 줄바꿈되더라도 container 밖으로 넘치지 않아야 한다.
- menu overlay의 기존 `bg-background/95`와 focus 가능한 구조를 유지한다.

## 3. Footer

| 요소 | 기준 |
|---|---|
| Main brand | `OPTIC` |
| Auxiliary text | `Powered by OPTICS` |
| Copyright | `OPTIC` 유지 |

`OPTICS`는 제품명처럼 전면 노출하지 않는다.

## 4. Logo

| 요소 | 기준 |
|---|---|
| Visual | 기존 텍스트/SVG 기반 임시 로고 유지 |
| Accessibility | `aria-label="OPTIC logo"` 또는 동등 label |
| Final asset | F5 release gate로 deferred |

## 5. Copy Rules

| 문구 | 사용 |
|---|---|
| `OPTIC` | 주 브랜드 |
| `OPTICS` | footer/About 보조 문맥 |
| `OPTIC 바로가기` | 서비스 확인 CTA |
| `도입 문의하기` | 문의 CTA |
| `서비스 테스트` | 새로 추가 금지 |
