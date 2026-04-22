# Bridge: Development Context — dash-preview

> **Feature**: Dashboard Preview (Hero Interactive Demo)
> **PRD**: `.plans/prd/10-approved/dashboard-preview-prd.md`
> **Architecture**: `.plans/project/00-dev-architecture.md`
> **Binding**: `.plans/features/active/dash-preview/00-context/06-architecture-binding.md`
> **Created**: 2026-04-14

---

## 1. Feature 요약

Hero 영역의 placeholder를 **AI 화물 등록 시네마틱 축소 뷰**로 교체한다.

- **Phase 1**: 자동 재생 5단계 데모 (18초 루프)
- **Phase 2**: 인터랙티브 탐색 (hover 하이라이트 + 클릭 mock 실행)
- **참조 UI**: `.references/code/mm-broker/app/broker/order/ai-register/page.tsx` main 영역
- **레이아웃**: Hero 중앙 정렬 단일 컬럼 유지, placeholder만 교체

## 2. 기술 스택

| 항목 | 값 |
|------|---|
| Framework | Next.js 15 (static export) |
| React | 18.3 |
| Animation | Framer Motion 11.15 |
| Styling | Tailwind CSS v4 + clsx + tailwind-merge |
| Icons | Lucide React 0.474 |
| Test | Vitest + React Testing Library |
| 새 패키지 | 없음 |

## 3. 파일 구조

```
apps/landing/src/
  components/
    dashboard-preview/
      dashboard-preview.tsx      # Container: 상태 머신 + useAutoPlay
      preview-chrome.tsx         # Chrome 프레임 + ScaledContent
      ai-panel-preview.tsx       # AiPanel 축소 뷰
      form-preview.tsx           # OrderRegisterForm 축소 뷰
      step-indicator.tsx         # 5-dot 하단 내비게이션
      mobile-card-view.tsx       # Mobile 전용 카드 뷰
      use-auto-play.ts           # 자동 재생 훅
      interactive-overlay.tsx    # [Phase 2] 히트 영역 + 툴팁
    sections/
      hero.tsx                   # 수정: placeholder → <DashboardPreview />
  lib/
    mock-data.ts                 # Mock 데이터 (카톡 메시지, AI 결과, 폼, 툴팁)
    preview-steps.ts             # Step 정의 (id, label, duration, states)
    motion.ts                    # 수정: Preview variants 추가
  __tests__/
    dashboard-preview/
      dashboard-preview.test.tsx
      use-auto-play.test.ts
      step-indicator.test.tsx
      ai-panel-preview.test.tsx
      form-preview.test.tsx
      mobile-card-view.test.tsx
      interactive-overlay.test.tsx  # [Phase 2]
```

## 4. 구현 순서 (Phase 1)

| Step | 기간 | 산출물 | 의존성 |
|------|------|--------|--------|
| 1-1 Foundation | 2~3일 | chrome, mock-data, preview-steps | — |
| 1-2 Core UI | 3~4일 | ai-panel-preview, form-preview | 1-1 |
| 1-3 Animations | 2~3일 | useAutoPlay, 5단계 전환 | 1-2 |
| 1-4 Step Indicator | 1~2일 | step-indicator, 클릭/hover | 1-3 |
| 1-5 Responsive | 2~3일 | mobile-card-view, Tablet 축약 | 1-2 |
| 1-6 Polish | 1~2일 | a11y, 성능, 크로스 브라우저 | 1-3,4,5 |

## 5. 핵심 구현 포인트

### 축소 뷰 (REQ-DASH-002)
```tsx
// ScaledContent: ref 기반 동적 높이 측정
const innerRef = useRef<HTMLDivElement>(null)
const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined)

useEffect(() => {
  if (!innerRef.current) return
  const updateHeight = () => {
    if (innerRef.current) {
      setScaledHeight(innerRef.current.scrollHeight * scaleFactor)
    }
  }
  updateHeight()
  const observer = new ResizeObserver(updateHeight)
  observer.observe(innerRef.current)
  return () => observer.disconnect()
}, [scaleFactor])

// 외부 래퍼: height를 축소된 값으로 고정
<div style={{ overflow: 'hidden', height: `${scaledHeight}px` }}>
  <div ref={innerRef} style={{
    transform: `scale(${scaleFactor})`,
    transformOrigin: 'top left',
    width: `${100 / scaleFactor}%`,
  }}>
    {children}
  </div>
</div>
```

### hero.tsx 수정 (레이아웃 변경 없음)
```diff
- <div className="rounded-2xl border border-gray-800 bg-gray-900/50 aspect-video ...">
-   <span className="text-gray-500 text-lg">Dashboard Preview</span>
- </div>
+ <DashboardPreview />
```

### useAutoPlay timeout 우선순위 (REQ-DASH-019)
```
pause(source: 'click') → 5초 후 resume
pause(source: 'hover') → 2초 후 resume
동시 발생 시: click(5s) 우선
```

## 6. 성능 제약

| 제약 | 값 | 검증 |
|------|---|------|
| JS 번들 | <30KB gzipped | `next build` 출력 |
| LCP 영향 | +100ms 미만 | Lighthouse CI |
| 프레임율 | 60fps | DevTools Performance |
| 등장 지연 | 0.6s delay | heading/CTA 이후 |

## 7. 참조 문서 전체 목록

| 문서 | 경로 |
|------|------|
| PRD (Approved) | `.plans/prd/10-approved/dashboard-preview-prd.md` |
| Wireframe screens | `.plans/wireframes/dash-preview/screens.md` |
| Wireframe navigation | `.plans/wireframes/dash-preview/navigation.md` |
| Wireframe components | `.plans/wireframes/dash-preview/components.md` |
| Stitch mapping | `.plans/stitch/dash-preview/mapping.md` |
| Stitch context | `.plans/stitch/dash-preview/context.md` |
| Stitch validation | `.plans/stitch/dash-preview/validation.md` |
| Architecture SSOT | `.plans/project/00-dev-architecture.md` |
| Architecture binding | `.plans/features/active/dash-preview/00-context/06-architecture-binding.md` |
| 참조 UI (AI Register) | `.references/code/mm-broker/app/broker/order/ai-register/page.tsx` |
| First-Pass 기획 | `.plans/archive/optic-landing-page/improvements/2026-04-14-dashboard-preview-phase-1.md` |
