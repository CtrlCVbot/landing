'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

/**
 * F1 T-THEME-02 — next-themes 래퍼.
 * Server Component인 layout.tsx에서 client-only ThemeProvider를 사용하기 위한
 * 'use client' wrapper (Next.js App Router 표준 패턴).
 *
 * 사용처: src/app/layout.tsx
 * Props는 next-themes ThemeProviderProps를 그대로 pass-through.
 */
export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />
}
