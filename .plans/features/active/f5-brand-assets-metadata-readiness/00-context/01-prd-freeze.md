# F5 PRD Freeze

## Goal

OPTIC 랜딩의 브랜드 자산, metadata, header/footer 접근성, 외부 링크 속성, 검증 기록을 공개 전 기준으로 정리한다.

## Acceptance Criteria

- `BRAND_ASSETS`와 `SITE_METADATA`가 단일 기준으로 존재한다.
- `metadata`가 favicon과 Open Graph 이미지를 참조한다.
- header/footer 로고가 `OPTIC 로고` 접근성 이름을 가진다.
- 외부 링크에는 `target="_blank"`와 `rel="noopener noreferrer"`가 적용된다.
- `typecheck`, `test`, `lint`, `build`, 문구 스캔, desktop/mobile preview 결과가 기록된다.

## Non-goals

- 신규 섹션 추가
- 실제 API 또는 배포 환경 변경
- 로고 raster 이미지 사용
