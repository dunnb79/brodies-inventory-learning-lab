import { BookOpen, Boxes, ShieldCheck } from 'lucide-react'

const points = [
  { icon: BookOpen, text: 'Explore core warehouse concepts at your own pace.' },
  { icon: Boxes, text: 'Practice inventory math with fictional sample parts.' },
  { icon: ShieldCheck, text: 'Runs entirely in your browser — no accounts, and nothing you enter is collected.' },
]

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-16 border-t bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">About</p>
          <h2 id="about-title" className="mt-2 text-balance text-3xl font-bold tracking-tight">
            About this project
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed">
            Created by Brodie Dunn as a personal learning project combining warehouse inventory concepts with
            hands-on website development.
          </p>
        </div>
        <ul className="flex flex-col gap-3 self-center">
          {points.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 rounded-xl border bg-card p-4">
              <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <p className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-primary-foreground/85 sm:px-6">
        Brodie&apos;s Inventory Learning Lab — Personal educational project. All examples are fictional.
      </p>
    </footer>
  )
}
