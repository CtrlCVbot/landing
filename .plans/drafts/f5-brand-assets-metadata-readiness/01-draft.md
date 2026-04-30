# F5 브랜드 자산, 메타데이터, 검증 정리 - Draft

> **IDEA**: [IDEA-20260430-002](../../ideas/20-approved/IDEA-20260430-002.md)
> **상태**: draft-approved
> **Lane**: Lite

---

## 1. 목표

OPTIC 랜딩의 공개 전 마무리 품질을 고정한다. 브랜드 자산, favicon/Open Graph metadata, header/footer 접근성 라벨, 외부 링크 속성, 검증 결과를 한 Feature Package 안에서 닫는다.

## 2. 범위

- `public/brand/optic-logo.svg`
- `public/brand/optic-mark.svg`
- `public/brand/optic-og.svg`
- `public/favicon.svg`
- `src/lib/constants.ts`의 브랜드 자산/메타데이터 상수
- `src/app/layout.tsx` metadata
- `src/components/icons/optic-logo.tsx`
- `src/components/sections/header.tsx`
- `src/components/sections/footer.tsx`
- 관련 테스트와 검증 로그

## 3. Out of Scope

- 실제 배포 도메인 변경
- 실서비스 인증, 회원가입, 결제, 대시보드 기능
- 로고 raster 이미지 재생성
- F1~F4 섹션 구조 변경

## 4. 주요 카피 기준

| 항목 | 기준 |
|---|---|
| title | `OPTIC - 화주와 주선사를 위한 맞춤 운송 운영` |
| description | 화주/주선사별 업무 방식에 맞춘 운송 운영 플랫폼 |
| 로고 접근성 | `OPTIC 로고` |
| 외부 서비스 링크 | 새 창 이동임을 접근성 라벨에 반영 |

## 5. 다음 단계

Lite handoff로 active feature package를 만들고 `/dev-run`으로 바로 진행한다.
