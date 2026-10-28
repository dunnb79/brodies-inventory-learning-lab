import { SiteHeader } from '@/components/site-header'
import { LearnSection } from '@/components/learn-section'
import { InventoryCalculator } from '@/components/inventory-calculator'
import { PracticeCount } from '@/components/practice-count'
import { AboutSection, SiteFooter } from '@/components/about-section'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <LearnSection />
        <InventoryCalculator />
        <PracticeCount />
        <AboutSection />
      </main>
      <SiteFooter />
    </>
  )
}
