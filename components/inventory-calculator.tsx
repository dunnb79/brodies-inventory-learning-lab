'use client'

import { useState } from 'react'
import { Calculator, Info, RotateCcw, TrendingDown, TrendingUp, CheckCircle2 } from 'lucide-react'
import { describeVariance, formatSigned, parseQuantity } from '@/lib/inventory'
import { cn } from '@/lib/utils'

const EXAMPLE = { starting: '100', received: '25', issued: '40', counted: '82' }
type Field = keyof typeof EXAMPLE

const fields: { key: Field; label: string; hint: string }[] = [
  { key: 'starting', label: 'Starting quantity', hint: 'On the record at the start' },
  { key: 'received', label: 'Quantity received', hint: 'Added from deliveries' },
  { key: 'issued', label: 'Quantity issued', hint: 'Sent out or used' },
  { key: 'counted', label: 'Physical count', hint: 'What you counted on the shelf' },
]

export function InventoryCalculator() {
  const [values, setValues] = useState(EXAMPLE)

  const parsed = {
    starting: parseQuantity(values.starting),
    received: parseQuantity(values.received),
    issued: parseQuantity(values.issued),
    counted: parseQuantity(values.counted),
  }

  const errors: Record<Field, string | null> = {
    starting: parsed.starting.error,
    received: parsed.received.error,
    issued: parsed.issued.error,
    counted: parsed.counted.error,
  }

  const available =
    parsed.starting.value !== null && parsed.received.value !== null
      ? parsed.starting.value + parsed.received.value
      : null

  if (!errors.issued && available !== null && parsed.issued.value !== null && parsed.issued.value > available) {
    errors.issued = `Issued can’t exceed available stock. Starting + received is only ${available.toLocaleString('en-US')}.`
  }

  const hasErrors = Object.values(errors).some(Boolean)
  const expected =
    !hasErrors && available !== null && parsed.issued.value !== null ? available - parsed.issued.value : null
  const variance = expected !== null && parsed.counted.value !== null ? parsed.counted.value - expected : null
  const result = variance !== null ? describeVariance(variance) : null

  return (
    <section id="calculator" aria-labelledby="calc-title" className="scroll-mt-16 border-y bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">Calculator</p>
        <h2 id="calc-title" className="mt-2 text-balance text-3xl font-bold tracking-tight">
          Interactive inventory calculator
        </h2>
        <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Enter whole-number quantities from 0 to 1,000,000. Results update as you type.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <form
            className="rounded-xl border bg-card p-6 shadow-sm"
            onSubmit={(e) => e.preventDefault()}
            noValidate
            aria-label="Inventory quantities"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map(({ key, label, hint }) => {
                const id = `calc-${key}`
                const error = errors[key]
                return (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label htmlFor={id} className="font-semibold">
                      {label}
                    </label>
                    <span id={`${id}-hint`} className="text-sm text-muted-foreground">
                      {hint}
                    </span>
                    <input
                      id={id}
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={values[key]}
                      onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                      aria-invalid={Boolean(error)}
                      aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`}
                      className={cn(
                        'min-h-12 rounded-lg border bg-background px-3 font-mono text-lg tabular-nums focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
                        error ? 'border-destructive' : 'border-input',
                      )}
                    />
                    {error && (
                      <p id={`${id}-error`} className="text-sm font-medium text-destructive">
                        {error}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
            <button
              type="button"
              onClick={() => setValues(EXAMPLE)}
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg border border-primary px-5 font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset example
            </button>
          </form>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-primary p-6 text-primary-foreground shadow-sm" aria-live="polite">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Calculator className="size-5" aria-hidden="true" />
                Results
              </h3>
              {expected !== null && variance !== null && result ? (
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-primary-foreground/10 p-4">
                    <dt className="text-sm text-primary-foreground/75">Expected quantity</dt>
                    <dd className="mt-1 font-mono text-3xl font-bold tabular-nums" data-testid="expected">
                      {expected.toLocaleString('en-US')}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-primary-foreground/10 p-4">
                    <dt className="text-sm text-primary-foreground/75">Variance</dt>
                    <dd className="mt-1 font-mono text-3xl font-bold tabular-nums" data-testid="variance">
                      {formatSigned(variance)}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-primary-foreground px-4 py-3 font-semibold text-primary sm:col-span-2">
                    {result.kind === 'shortage' && <TrendingDown className="size-5 text-destructive" aria-hidden="true" />}
                    {result.kind === 'surplus' && <TrendingUp className="size-5 text-warning" aria-hidden="true" />}
                    {result.kind === 'match' && <CheckCircle2 className="size-5 text-success" aria-hidden="true" />}
                    <dt className="sr-only">Meaning</dt>
                    <dd data-testid="meaning">{result.label}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-4 rounded-lg bg-primary-foreground/10 p-4 text-primary-foreground/85">
                  Fix the highlighted fields to see your results.
                </p>
              )}
              <div className="mt-5 flex flex-col gap-1 border-t border-primary-foreground/15 pt-4 font-mono text-sm text-primary-foreground/80">
                <p>Expected = starting + received − issued</p>
                <p>Variance = physical count − expected</p>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">What the sign means</h3>
              <ul className="mt-3 flex flex-col gap-3 text-sm leading-relaxed">
                <li className="flex gap-3">
                  <span className="w-10 shrink-0 font-mono font-bold text-destructive">−</span>
                  <span><strong>Negative variance:</strong> shortage compared with the record.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-10 shrink-0 font-mono font-bold text-success">0</span>
                  <span><strong>Zero variance:</strong> physical count matches the record.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-10 shrink-0 font-mono font-bold text-warning">+</span>
                  <span><strong>Positive variance:</strong> surplus compared with the record.</span>
                </li>
              </ul>
              <p className="mt-4 flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                This simplified model excludes returns, transfers, and other adjustments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
