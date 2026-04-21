'use client'

import { useEffect, useState } from 'react'

export function useScrollSpy(sectionIds: readonly string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    for (const element of elements) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [sectionIds])

  return activeId
}
