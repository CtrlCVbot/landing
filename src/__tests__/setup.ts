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
