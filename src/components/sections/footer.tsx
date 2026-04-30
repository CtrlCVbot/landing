'use client'

import { BRAND, FOOTER_LINKS } from '@/lib/constants'
import { OpticLogo } from '@/components/icons/optic-logo'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-20 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <OpticLogo className="text-foreground" width={112} height={28} />
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
                      target={'target' in link ? link.target : undefined}
                      rel={'rel' in link ? link.rel : undefined}
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
          <span className="text-sm text-muted-foreground">
            {BRAND.poweredByLabel}
          </span>
          <span className="text-sm text-muted-foreground">
            {BRAND.copyrightLabel}
          </span>
        </div>
      </div>
    </footer>
  )
}
