import '@testing-library/jest-dom/vitest'

// ResizeObserver mock for jsdom
global.ResizeObserver = class ResizeObserver {
  private callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// matchMedia mock for jsdom — 기본적으로 prefers-reduced-motion: no-preference.
// 각 테스트에서 필요 시 window.matchMedia 를 덮어써 'reduce' 매칭을 시뮬레이션한다.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
