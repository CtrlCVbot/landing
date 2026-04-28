'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface HeroLiquidGradientBackgroundProps {
  readonly className?: string
}

interface HeroFieldPalette {
  readonly base: string
  readonly colors: readonly string[]
  readonly edgeVeil: string
  readonly bottomFade: string
}

const BLOB_SEED = Array.from({ length: 10 }, (_, index) => ({
  x: (index * 0.137 + 0.19) % 1,
  y: (index * 0.211 + 0.28) % 1,
  radius: 0.18 + (index % 4) * 0.035,
  speed: 0.00016 + index * 0.000018,
  phase: index * 1.73,
  color: index % 5,
}))

function readCssVariable(
  styles: CSSStyleDeclaration,
  name: string,
  fallback: string,
): string {
  return styles.getPropertyValue(name).trim() || fallback
}

function readRgbVariable(
  styles: CSSStyleDeclaration,
  name: string,
  fallback: string,
): string {
  return readCssVariable(styles, name, fallback).replace(/\s+/g, ', ')
}

function rgba(rgb: string, alpha: number): string {
  return `rgba(${rgb}, ${alpha})`
}

export function HeroLiquidGradientBackground({
  className,
}: HeroLiquidGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const targetCanvas = canvas

    let context: CanvasRenderingContext2D | null = null

    try {
      context = targetCanvas.getContext('2d', { alpha: false })
    } catch {
      context = null
    }

    if (!context) return

    const ctx = context
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(pointer: fine)')
    const mobileQuery = window.matchMedia('(max-width: 640px)')
    const requestFrame =
      window.requestAnimationFrame ??
      ((callback: FrameRequestCallback) =>
        window.setTimeout(() => callback(performance.now()), 16))
    const cancelFrame =
      window.cancelAnimationFrame ??
      ((handle: number) => window.clearTimeout(handle))

    let width = 1
    let height = 1
    let frame = 0
    let stopped = false
    let palette = readPalette()
    const pointer = {
      x: 0.52,
      y: 0.42,
      targetX: 0.52,
      targetY: 0.42,
      active: false,
    }

    function readPalette(): HeroFieldPalette {
      const styles = getComputedStyle(document.documentElement)
      const aurora = readRgbVariable(styles, '--hero-field-aurora-rgb', '124, 58, 237')
      const tide = readRgbVariable(styles, '--hero-field-tide-rgb', '37, 99, 235')
      const signal = readRgbVariable(styles, '--hero-field-signal-rgb', '6, 182, 212')
      const warm = readRgbVariable(styles, '--hero-field-warm-rgb', '245, 158, 11')
      const glass = readRgbVariable(styles, '--hero-field-glass-rgb', '224, 242, 254')

      return {
        base: readCssVariable(styles, '--hero-field-base', '#ffffff'),
        colors: [aurora, tide, signal, warm, glass],
        edgeVeil: readCssVariable(
          styles,
          '--hero-field-edge-veil',
          'rgba(255, 255, 255, 0.42)',
        ),
        bottomFade: readCssVariable(
          styles,
          '--hero-field-bottom-fade',
          'rgba(255, 255, 255, 0.9)',
        ),
      }
    }

    function resizeCanvas() {
      const rect = targetCanvas.parentElement?.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect?.width || window.innerWidth || 1))
      height = Math.max(1, Math.floor(rect?.height || window.innerHeight || 1))

      const ratio = Math.min(
        window.devicePixelRatio || 1,
        mobileQuery.matches ? 1.25 : 1.75,
      )

      targetCanvas.width = Math.floor(width * ratio)
      targetCanvas.height = Math.floor(height * ratio)
      targetCanvas.style.width = `${width}px`
      targetCanvas.style.height = `${height}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    function drawBlob(
      x: number,
      y: number,
      radius: number,
      color: string,
      strength: number,
    ) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
      gradient.addColorStop(0, rgba(color, strength))
      gradient.addColorStop(0.46, rgba(color, strength * 0.62))
      gradient.addColorStop(1, rgba(color, 0))
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    function paint(time = 0, scheduleNext = true) {
      if (stopped) return

      pointer.x += (pointer.targetX - pointer.x) * 0.055
      pointer.y += (pointer.targetY - pointer.y) * 0.055

      const base = ctx.createLinearGradient(0, 0, width, height)
      base.addColorStop(0, palette.base)
      base.addColorStop(0.42, rgba(palette.colors[0], 0.16))
      base.addColorStop(0.72, rgba(palette.colors[1], 0.14))
      base.addColorStop(1, palette.base)
      ctx.fillStyle = base
      ctx.fillRect(0, 0, width, height)

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.filter = `blur(${Math.max(22, Math.min(width, height) * 0.045)}px) saturate(136%)`

      const blobCount = mobileQuery.matches ? 6 : BLOB_SEED.length
      BLOB_SEED.slice(0, blobCount).forEach((blob, index) => {
        const drift = motionQuery.matches ? 0 : time * blob.speed
        const x =
          (0.5 + Math.sin(drift + blob.phase) * 0.38 + blob.x * 0.18) * width
        const y =
          (0.5 + Math.cos(drift * 0.86 + blob.phase) * 0.34 + blob.y * 0.16) *
          height
        const radius =
          Math.min(width, height) *
          blob.radius *
          (mobileQuery.matches ? 0.78 : index % 2 ? 1.15 : 0.92)
        const blobStrength = blob.color === 2 || blob.color === 3 ? 0.3 : 0.62

        drawBlob(x, y, radius, palette.colors[blob.color], blobStrength)
      })

      if (pointerQuery.matches && !motionQuery.matches) {
        drawBlob(
          pointer.x * width,
          pointer.y * height,
          Math.min(width, height) * 0.3,
          palette.colors[0],
          pointer.active ? 0.36 : 0.24,
        )
      }

      ctx.restore()

      const veil = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.82,
      )
      veil.addColorStop(0, 'rgba(0, 0, 0, 0)')
      veil.addColorStop(1, palette.edgeVeil)
      ctx.fillStyle = veil
      ctx.fillRect(0, 0, width, height)

      const bottomVeil = ctx.createLinearGradient(0, height * 0.55, 0, height)
      bottomVeil.addColorStop(0, 'rgba(0, 0, 0, 0)')
      bottomVeil.addColorStop(1, palette.bottomFade)
      ctx.fillStyle = bottomVeil
      ctx.fillRect(0, height * 0.55, width, height * 0.45)

      if (scheduleNext && !motionQuery.matches && document.visibilityState !== 'hidden') {
        frame = requestFrame((nextTime) => paint(nextTime, true))
      }
    }

    function repaint() {
      cancelFrame(frame)
      palette = readPalette()
      resizeCanvas()
      paint(0, !motionQuery.matches)
    }

    function handlePointerMove(event: PointerEvent) {
      if (!pointerQuery.matches || motionQuery.matches) return
      pointer.targetX = event.clientX / Math.max(1, width)
      pointer.targetY = event.clientY / Math.max(1, height)
      pointer.active = true
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        cancelFrame(frame)
        return
      }

      repaint()
    }

    const observer = new MutationObserver(repaint)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    window.addEventListener('resize', repaint)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    motionQuery.addEventListener('change', repaint)
    mobileQuery.addEventListener('change', repaint)
    repaint()

    return () => {
      stopped = true
      cancelFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', repaint)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      motionQuery.removeEventListener('change', repaint)
      mobileQuery.removeEventListener('change', repaint)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      data-implementation-route="canvas-2d-css-fallback"
      data-testid="hero-liquid-gradient-background"
      className={cn(
        'hero-liquid-gradient-background absolute inset-0 z-0 pointer-events-none overflow-hidden',
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        data-testid="hero-liquid-gradient-canvas"
        className="hero-liquid-gradient-background__canvas"
      />
      <div
        data-testid="hero-liquid-gradient-fallback"
        className="hero-liquid-gradient-background__fallback hero-liquid-gradient-background__field"
      />
    </div>
  )
}
