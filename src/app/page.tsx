import { Header } from '@/components/sections/header'
import { Hero } from '@/components/sections/hero'
import { Problems } from '@/components/sections/problems'
import { Features } from '@/components/sections/features'
import { Products } from '@/components/sections/products'
import { Integrations } from '@/components/sections/integrations'
import { Cta } from '@/components/sections/cta'
import { Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problems />
        <Features />
        <Products />
        <Integrations />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
