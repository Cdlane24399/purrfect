import { useState } from 'react'
import { Reveal, Icon } from './ui.jsx'

function WaitlistCTA() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | sending | done | error
  const submit = async (e) => {
    e.preventDefault()
    if (!email || state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('signup failed')
      setState('done')
    } catch {
      setState('error')
    }
  }
  return (
    <Reveal>
      <div id="waitlist" className="relative scroll-mt-24 overflow-hidden rounded-[2.6rem] bg-espresso p-2 ring-1 ring-espresso soft-lift-lg">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-[radial-gradient(circle_at_50%_-20%,#3c2e21,#221912)] px-8 py-16 text-center sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -right-10 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(200,180,154,0.22),transparent_60%)] blur-2xl" />
          <span className="eyebrow justify-center text-clay">
            <span className="h-1 w-1 rounded-full bg-clay" /> Join the litter
          </span>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.6vw,3.6rem)] font-light leading-[1.04] text-cream text-balance">
            Be first when we <span className="it text-clay">launch</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-cream/70">
            Our debut collection is in production. Join the waitlist for launch news, early access
            and a member-only welcome offer.
          </p>

          {state === 'done' ? (
            <div className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-full bg-cream/10 px-6 py-4 text-[13px] text-cream ring-1 ring-cream/15">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage/30 text-sage">
                <Icon.Check className="text-[14px]" />
              </span>
              You&apos;re on the list — we&apos;ll email you at launch.
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="mx-auto mt-9 flex max-w-md flex-col items-stretch gap-2 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@home.com"
                className="flex-1 rounded-full bg-cream/10 px-6 py-4 text-[14px] text-cream placeholder-cream/40 outline-none ring-1 ring-cream/15 transition focus:ring-cream/40"
              />
              <button
                type="submit"
                disabled={state === 'sending'}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-cream px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-all duration-500 ease-silk hover:gap-3.5 active:scale-[0.97] disabled:opacity-60"
              >
                {state === 'sending' ? 'Joining…' : 'Notify me'}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                  <Icon.ArrowUR className="text-[13px]" />
                </span>
              </button>
            </form>
          )}
          {state === 'error' && (
            <p className="mt-4 text-[12px] text-clay">
              Something went wrong — please try again in a moment.
            </p>
          )}
          <p className="mt-5 text-[11px] text-cream/45">
            Only launch updates — no spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </Reveal>
  )
}

const COLS = [
  {
    title: 'Explore',
    links: [
      ['The collection', '#shop'],
      ['Curated sets', '#sets'],
      ['Fresh Play', '#subscribe'],
      ['Materials & impact', '#materials'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['Our story', '#story'],
      ['Join the waitlist', '#waitlist'],
      ['Contact', 'mailto:info@feltfern.com'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative pb-10 pt-8">
      <div className="shell">
        <WaitlistCTA />

        <div className="mt-20 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4">
          {/* brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 72 72" className="h-8 w-auto" fill="none" aria-hidden>
                <circle cx="36" cy="36" r="31" stroke="currentColor" strokeWidth="3" />
                <path
                  d="M23 48V22h17M23 35h14M44 50V22M44 35c8 0 13-4 14-11"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M50 27c5 1 9 5 10 10-6 0-10-4-10-10Z" fill="currentColor" />
              </svg>
              <span className="text-[14px] font-semibold uppercase tracking-[0.24em] text-ink">
                Felt &amp; Fern
              </span>
            </div>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-bark/70">
              Minimalist, sustainably made cat toys &amp; furniture for design-conscious homes.
              Engineered around feline instinct and finished with a quieter footprint.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-bark/55">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" /> Launching soon
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bark/55">
                {c.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="line-draw text-[13px] text-bark/85 hover:text-ink">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-bark/10 pt-8 text-[11px] uppercase tracking-[0.14em] text-bark/50 sm:flex-row">
          <span>© 2026 Felt &amp; Fern · Designed for cats</span>
          <span className="flex items-center gap-2">
            <Icon.Paw className="text-[14px]" /> Launching soon
          </span>
        </div>
      </div>
    </footer>
  )
}
