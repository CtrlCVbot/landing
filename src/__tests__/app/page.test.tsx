import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Home from '@/app/page'

vi.mock('@/components/sections/header', () => ({
  Header: () => <header>Header</header>,
}))

vi.mock('@/components/sections/hero', () => ({
  Hero: () => <section>Hero</section>,
}))

vi.mock('@/components/sections/problems', () => ({
  Problems: () => <section>Problems</section>,
}))

vi.mock('@/components/sections/features', () => ({
  Features: () => <section>Features</section>,
}))

vi.mock('@/components/sections/products', () => ({
  Products: () => <section>Products</section>,
}))

vi.mock('@/components/sections/workflow-manual', () => ({
  WorkflowManual: () => <section>Workflow Manual</section>,
}))

vi.mock('@/components/sections/integrations', () => ({
  Integrations: () => <section>Integrations</section>,
}))

vi.mock('@/components/sections/cta', () => ({
  Cta: () => <section>Cta</section>,
}))

vi.mock('@/components/sections/footer', () => ({
  Footer: () => <footer>Footer</footer>,
}))

describe('Home page composition - F3 workflow section', () => {
  it('places WorkflowManual after Products and before Integrations', () => {
    render(<Home />)

    const mainText = screen.getByRole('main').textContent
    expect(mainText).toMatch(
      /Hero.*Problems.*Features.*Products.*Workflow Manual.*Integrations.*Cta/,
    )
  })
})
