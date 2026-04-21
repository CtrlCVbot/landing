import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * dash-preview-phase3 T-DASH3-M1-07 — Legacy 격리 (A안)
 *
 * 기본(LEGACY 미설정): src/__tests__/dashboard-preview/legacy/ 디렉터리 테스트 제외.
 *   → Phase 3 신규 테스트와 병행 실행 시 간섭 없음.
 * LEGACY=true 설정 시: legacy 디렉터리 포함하여 회귀 테스트 실행.
 *   예) `cross-env LEGACY=true pnpm test` 또는 `LEGACY=true pnpm test` (bash)
 */
const LEGACY_MODE = process.env.LEGACY === 'true'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: LEGACY_MODE
      ? ['**/node_modules/**', '**/dist/**']
      : ['**/node_modules/**', '**/dist/**', 'src/__tests__/dashboard-preview/legacy/**'],
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
