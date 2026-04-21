'use client'

import { useCallback } from 'react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StepIndicatorProps {
  readonly totalSteps: number
  readonly currentStep: number
  readonly onStepClick: (index: number) => void
  readonly className?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StepIndicator({
  totalSteps,
  currentStep,
  onStepClick,
  className,
}: StepIndicatorProps) {
  const handleKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onStepClick(index)
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        const nextIndex = (index + 1) % totalSteps
        onStepClick(nextIndex)
        // 포커스 이동: 다음 dot 버튼으로
        const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button[role="tab"]')
        buttons?.[nextIndex]?.focus()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        const prevIndex = (index - 1 + totalSteps) % totalSteps
        onStepClick(prevIndex)
        const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button[role="tab"]')
        buttons?.[prevIndex]?.focus()
      }
    },
    [onStepClick, totalSteps],
  )

  return (
    <div
      role="tablist"
      className={cn('flex gap-2 items-center justify-center py-2', className)}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const isActive = index === currentStep

        return (
          <button
            key={index}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-label={`Step ${index + 1}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onStepClick(index)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className={cn(
              'w-2 h-2 rounded-full cursor-pointer transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 scale-125'
                : 'bg-gray-600 hover:bg-gray-500',
            )}
          />
        )
      })}
    </div>
  )
}
