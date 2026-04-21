'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { cn } from '@/lib/utils'

const SECTION_IDS = NAV_LINKS.map((link) => link.href.replace('#', ''))

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const activeId = useScrollSpy(SECTION_IDS)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function closeMobile() {
    setIsMobileOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full h-16 transition-colors duration-300',
        isScrolled && 'bg-black/80 backdrop-blur-lg border-b border-gray-800',
      )}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-20 h-full flex items-center justify-between">
        <a href="#" className="text-xl font-bold text-white">
          OPTIC
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace('#', '')
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  activeId === sectionId ? 'text-white' : 'text-gray-400 hover:text-gray-200',
                )}
              >
                {link.label}
              </a>
            )
          })}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-block text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-2 rounded-lg"
        >
          도입 문의하기
        </a>

        <button
          type="button"
          className="md:hidden text-white"
          onClick={() => setIsMobileOpen(true)}
          aria-label="메뉴 열기"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center gap-8">
          <button
            type="button"
            className="absolute top-5 right-5 text-white"
            onClick={closeMobile}
            aria-label="메뉴 닫기"
          >
            <X className="w-6 h-6" />
          </button>

          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-2xl font-medium text-gray-200 hover:text-white"
              onClick={closeMobile}
            >
              {link.label}
            </a>
          ))}

          <a
            href="#contact"
            className="text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 rounded-xl"
            onClick={closeMobile}
          >
            도입 문의하기
          </a>
        </div>
      )}
    </header>
  )
}
