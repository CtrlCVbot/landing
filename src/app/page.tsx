import { Header } from '@/components/sections/header'
import { Hero } from '@/components/sections/hero'
import { Problems } from '@/components/sections/problems'
import { Features } from '@/components/sections/features'
import { Products } from '@/components/sections/products'
import { Integrations } from '@/components/sections/integrations'
import { Cta } from '@/components/sections/cta'
import { Footer } from '@/components/sections/footer'

// NOTE: Spike feature flag(?spike=1)는 Hero 내부의 client-side useSearchParams로 분기한다.
// output: 'export' 정적 빌드와의 호환성을 위해 Server Component는 sync 유지.
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
