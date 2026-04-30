# F4 Architecture Binding

| Layer | Binding |
|---|---|
| Data | `src/lib/landing-workflow.ts` |
| Motion | `src/lib/motion.ts` |
| UI | `src/components/sections/workflow-manual.tsx` |
| Page | 기존 `src/app/page.tsx` 변경 없음 |
| Tests | lib/component tests |

## Boundary

DashboardPreview, package manager, route structure, external API integration은 수정하지 않는다.
