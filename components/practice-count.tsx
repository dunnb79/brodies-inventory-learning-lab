'use client'

import { useState } from 'react'
import { CheckCircle2, ClipboardList, RotateCcw, XCircle } from 'lucide-react'
import { describeVariance, formatSigned, parseSignedWhole } from '@/lib/inventory'
import { cn } from '@/lib/utils'

const parts = [
  { id: 'LAB-101', description: 'Practice filter', bin: 'A-01', expected: 20, counted: 18 },
  { id: 'LAB-102', description: 'Practice gasket', bin: 'A-02', expected: 15, counted: 15 },
  { id: 'LAB-103', description: 'Practice fitting', bin: 'B-01', expected: 10, counted: 12 },
]

type Feedback = { status: 'correct' | 'incorrect' | 'invalid'; message: string }

const emptyAnswers = Object.fromEntries(parts.map((p) => [p.id, ''])) as Record<string, string>

export function PracticeCount() {
  const [answers, setAnswers] = useState(emptyAnswers)
  const [feedback, setFeedback] = useState<Record<string, Feedback> | null>(null)

  const check = () => {
    const next: Record<string, Feedback> = {}
    for (const part of parts) {
      const correct = part.counted - part.expected
      const meaning = describeVariance(correct).label.toLowerCase()
      const work = `${part.counted} counted − ${part.expected} expected = ${formatSigned(correct)}`
      const parsed = parseSignedWhole(answers[part.id])
      if (parsed.value === null) {
        next[part.id] = { status: 'invalid', message: parsed.error }
      } else if (parsed.value === correct) {
        next[part.id] = { status: 'correct', message: `Nice work! ${work}: ${meaning}.` }
      } else {
        next[part.id] = {
          status: 'incorrect',
          message: `Not quite. ${work}: ${meaning}. Remember: counted minus expected.`,
        }
      }
    }
    setFeedback(next)
  }

  const reset = () => {
    setAnswers(emptyAnswers)
    setFeedback(null)
  }

  const correctCount = feedback ? Object.values(feedback).filter((f) => f.status === 'correct').length : 0

  return (
    <section id="practice" aria-labelledby="practice-title" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Practice</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 id="practice-title" className="text-balance text-3xl font-bold tracking-tight">
            Practice a warehouse count
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
            <ClipboardList className="size-4" aria-hidden="true" />
            Fictional training data
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          For each part, enter the variance (physical count − expected). Use signed whole numbers like{' '}
          <span className="font-mono">-2</span>, <span className="font-mono">0</span>, or{' '}
          <span className="font-mono">+2</span>.
        </p>

        <form
          className="mt-10"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            check()
          }}
        >
          <div role="table" aria-label="Practice count sheet" className="md:overflow-hidden md:rounded-xl md:border md:bg-card md:shadow-sm">
            <div role="rowgroup" className="hidden md:block">
              <div
                role="row"
                className="grid grid-cols-[0.9fr_1.4fr_0.7fr_0.8fr_0.8fr_1.2fr] gap-4 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                <span role="columnheader">Part #</span>
                <span role="columnheader">Part Description</span>
                <span role="columnheader">Bin</span>
                <span role="columnheader">Expected</span>
                <span role="columnheader">Counted</span>
                <span role="columnheader">Your variance</span>
              </div>
            </div>
            <div role="rowgroup" className="flex flex-col gap-4 md:gap-0">
              {parts.map((part) => {
                const fb = feedback?.[part.id]
                const inputId = `variance-${part.id}`
                return (
                  <div
                    key={part.id}
                    role="row"
                    className="rounded-xl border bg-card p-5 shadow-sm md:rounded-none md:border-0 md:border-t md:shadow-none md:first:border-t-0"
                  >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-[0.9fr_1.4fr_0.7fr_0.8fr_0.8fr_1.2fr] md:items-center">
                      <Cell label="Part #" className="font-mono font-semibold">{part.id}</Cell>
                      <Cell label="Part Description">{part.description}</Cell>
                      <Cell label="Bin" className="font-mono">{part.bin}</Cell>
                      <Cell label="Expected" className="font-mono tabular-nums">{part.expected}</Cell>
                      <Cell label="Counted" className="font-mono tabular-nums">{part.counted}</Cell>
                      <div role="cell" className="col-span-2 flex flex-col gap-1 md:col-span-1">
                        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground md:sr-only">
                          Your variance for {part.id}
                        </label>
                        <input
                          id={inputId}
                          type="text"
                          inputMode="text"
                          autoComplete="off"
                          placeholder="e.g. -2"
                          value={answers[part.id]}
                          onChange={(e) => setAnswers((a) => ({ ...a, [part.id]: e.target.value }))}
                          aria-invalid={fb ? fb.status !== 'correct' : undefined}
                          aria-describedby={fb ? `${inputId}-fb` : undefined}
                          className={cn(
                            'min-h-12 w-full rounded-lg border bg-background px-3 font-mono text-lg tabular-nums focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
                            fb?.status === 'correct' && 'border-success',
                            fb && fb.status !== 'correct' && 'border-destructive',
                            !fb && 'border-input',
                          )}
                        />
                      </div>
                    </div>
                    {fb && (
                      <p
                        id={`${inputId}-fb`}
                        className={cn(
                          'mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-sm leading-relaxed',
                          fb.status === 'correct' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
                        )}
                      >
                        {fb.status === 'correct' ? (
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        ) : (
                          <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                        )}
                        <span>{fb.message}</span>
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 font-semibold text-accent-foreground transition-colors hover:bg-[oklch(0.45_0.09_192)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Check my answers
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-primary px-6 font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset practice
            </button>
          </div>

          <p aria-live="polite" className="mt-4 min-h-6 font-semibold" data-testid="practice-summary">
            {feedback &&
              (correctCount === parts.length
                ? `All ${parts.length} correct — great counting!`
                : `${correctCount} of ${parts.length} correct. Review the notes above and try again.`)}
          </p>
        </form>
      </div>
    </section>
  )
}

function Cell({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="cell" className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground md:sr-only">{label}</span>
      <span className={className}>{children}</span>
    </div>
  )
}
