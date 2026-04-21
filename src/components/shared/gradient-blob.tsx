'use client'

import { cn } from '@/lib/utils'

interface GradientBlobProps {
  readonly className?: string
}

export function GradientBlob({ className }: GradientBlobProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'absolute w-72 h-72 rounded-full pointer-events-none opacity-20 blur-3xl',
        'bg-[radial-gradient(circle,_rgba(168,85,247,0.8)_0%,_rgba(59,130,246,0.6)_100%)]',
        className,
      )}
    />
  )
}
