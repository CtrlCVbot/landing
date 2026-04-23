'use client'

import { FOOTER_LINKS } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-20 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="text-xl font-bold text-foreground">OPTIC</span>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.group}>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {group.group}
              </h4>
              <ul>
                {group.links.map((link) => (
                  <li key={link.label} className="mb-2">
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-muted-foreground">Powered by OPTICS</span>
          <span className="text-sm text-muted-foreground">
            &copy; 2026 OPTIC. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}
