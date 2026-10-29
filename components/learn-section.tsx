import { ArrowRight, BookOpen, ClipboardCheck, MapPin, PackageCheck, Scale } from 'lucide-react'

const basics = [
  {
    icon: PackageCheck,
    title: 'Receiving',
    body: 'Checking delivered items against what was ordered and recording the quantities actually received.',
  },
  {
    icon: MapPin,
    title: 'Bin locations',
    body: 'Identifying exactly where each part is physically stored, such as aisle A, bin 01.',
  },
  {
    icon: ClipboardCheck,
    title: 'Cycle counting',
    body: 'Counting a selected group of items on a regular schedule to check that inventory records are accurate.',
  },
  {
    icon: Scale,
    title: 'Reconciliation',
    body: 'Investigating differences between records and physical counts before making an approved correction.',
  },
]

export function LearnSection() {
  return (
    <>
      <section id="top" aria-labelledby="hero-title" className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-[1.3fr_1fr] md:items-center md:pb-24 md:pt-20">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-sm font-medium text-[oklch(0.85_0.08_192)]">
              <BookOpen className="size-4" aria-hidden="true" />
              A beginner-friendly learning project
            </p>
            <h1 id="hero-title" className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Know the count. Understand the difference.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/85">
              Learn warehouse basics, try inventory math, and practice with fictional parts.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#calculator"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 font-semibold text-accent-foreground transition-colors hover:bg-[oklch(0.45_0.09_192)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
              >
                Try the calculator
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#learn"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-primary-foreground/40 px-6 font-semibold transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
              >
                Learn the basics
              </a>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hidden rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 font-mono text-sm md:block"
          >
            <p className="mb-4 text-xs uppercase tracking-widest text-primary-foreground/60">Sample count sheet</p>
            <dl className="flex flex-col gap-3">
              {[
                ['Starting', '100'],
                ['+ Received', '25'],
                ['− Issued', '40'],
                ['= Expected', '85'],
                ['Counted', '82'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-dashed border-primary-foreground/15 pb-2">
                  <dt className="text-primary-foreground/75">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between rounded-md bg-accent px-3 py-2 text-accent-foreground">
                <dt>Variance</dt>
                <dd className="font-semibold">−3</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section id="learn" aria-labelledby="learn-title" className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Learn</p>
          <h2 id="learn-title" className="mt-2 text-balance text-3xl font-bold tracking-tight">
            Inventory basics
          </h2>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Four everyday warehouse ideas that keep records and shelves in agreement.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {basics.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-xl border bg-card p-6 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
