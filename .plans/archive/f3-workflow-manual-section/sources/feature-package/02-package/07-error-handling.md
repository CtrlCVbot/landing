# 07. Error Handling - F3 업무 매뉴얼형 스크롤 섹션 MVP

---

## 1. Runtime Error Scope

F3는 static data 기반 section이므로 사용자 입력, 네트워크 요청, 서버 에러 처리는 없다. 주요 리스크는 렌더링 누락, 문구 오해, 모바일 overflow다.

## 2. Failure Modes

| 실패 모드 | 영향 | 대응 |
|---|---|---|
| workflow data 누락 | section render 실패 또는 빈 카드 | data test에서 6개 step 보장 |
| icon key 누락 | icon 미표시 | icon은 optional 처리하거나 fallback 유지 |
| 긴 한글 문구 overflow | 모바일 품질 저하 | card width, wrapping, copy 길이 조정 |
| 실제 API 연동처럼 보이는 문구 | 사업/신뢰 리스크 | copy guard scan |
| Products section과 중복 | 랜딩 흐름 혼탁 | F3는 제품이 아닌 업무 순서로 표현 |

## 3. UI Fallback

| 항목 | 기준 |
|---|---|
| Icon fallback | icon이 없어도 title/description으로 이해 가능해야 함 |
| CTA fallback | CTA가 없거나 숨겨져도 workflow 정보 전달 가능해야 함 |
| Motion fallback | animation 없이 static 상태로 완전 이해 가능해야 함 |

## 4. Error Copy

에러 메시지는 신규로 만들지 않는다. 이 section은 설명형 UI이므로 error state를 도입하지 않는다.

## 5. Review Checklist

- [ ] step data가 비어 있어도 빌드 타임 또는 테스트에서 잡힌다.
- [ ] 375px 모바일에서 title, customization label, CTA가 겹치지 않는다.
- [ ] 실제 연동 완료를 약속하는 문구가 없다.
- [ ] DashboardPreview 관련 파일이 수정되지 않았다.
