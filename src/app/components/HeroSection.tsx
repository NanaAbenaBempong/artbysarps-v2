'use client'

import { useState, useEffect } from 'react'

// ── Constants ─────────────────────────────────────────────────────────────────

const NAME_CHARS = 'Sarpomaa\nBempong'.split('')  // \n at index 8 snaps instantly
const NAME_INSTANT = new Set([' ', '\n'])

const TAGLINE_DATA = [
  { text: 'Designing products' },
  { text: 'Painting worlds' },
  { text: 'Telling stories' },
]

const POOL = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789@#$%&!'

type CS = { ch: string; locked: boolean }

// ── Icons ─────────────────────────────────────────────────────────────────────

function LaptopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="1.5" width="12" height="8" rx="1" />
      <path d="M0 11.5h14" />
    </svg>
  )
}

function PaintbrushIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 1.5L12.5 4.5L5 12H2V9L9.5 1.5Z" />
      <path d="M7.5 3.5L10.5 6.5" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 2L12 6L4 14H1V11L8 2Z" />
      <path d="M6 4L10 8" />
    </svg>
  )
}

const ICONS = [LaptopIcon, PaintbrushIcon, PenIcon]

// ── Component ─────────────────────────────────────────────────────────────────

export default function HeroSection() {
  // null = SSR / pre-mount: render static content
  const [nameChars, setNameChars]     = useState<CS[] | null>(null)
  const [taglines,  setTaglines]      = useState<Array<{ visible: boolean; chars: CS[] }> | null>(null)

  useEffect(() => {
    let cancelled = false

    // Initialise to pending state
    setNameChars(NAME_CHARS.map(() => ({ ch: '', locked: false })))
    setTaglines(TAGLINE_DATA.map(t => ({
      visible: false,
      chars: t.text.split('').map(() => ({ ch: '', locked: false })),
    })))

    const wait = (ms: number) => new Promise<void>(res => setTimeout(res, ms))

    // Generic scramble: animates an array of chars in-place via a setter
    async function scramble(
      chars:    string[],
      setSlice: (updater: (prev: CS[]) => CS[]) => void,
      flickerMs: number,
      gapMs:     number,
      instant:   Set<string>,
    ) {
      for (let i = 0; i < chars.length; i++) {
        if (cancelled) return
        const actual = chars[i]
        if (instant.has(actual)) {
          setSlice(prev => {
            const next = [...prev]; next[i] = { ch: actual, locked: true }; return next
          })
        } else {
          const flickers = 4 + Math.floor(Math.random() * 2)
          for (let f = 0; f < flickers; f++) {
            if (cancelled) return
            const rand = POOL[Math.floor(Math.random() * POOL.length)]
            setSlice(prev => {
              const next = [...prev]; next[i] = { ch: rand, locked: false }; return next
            })
            await wait(flickerMs)
          }
          if (cancelled) return
          setSlice(prev => {
            const next = [...prev]; next[i] = { ch: actual, locked: true }; return next
          })
        }
        await wait(gapMs)
      }
    }

    async function run() {
      await wait(120)

      // Step 1 — name
      await scramble(
        NAME_CHARS,
        upd => setNameChars(prev => prev ? upd(prev) : prev),
        40, 55, NAME_INSTANT,
      )

      if (cancelled) return
      await wait(150)

      // Step 2 — taglines one by one
      for (let t = 0; t < TAGLINE_DATA.length; t++) {
        if (cancelled) return

        // Reveal row (icon appears together with the text)
        setTaglines(prev => {
          if (!prev) return prev
          const next = [...prev]
          next[t] = { ...next[t], visible: true }
          return next
        })

        // Scramble that row's text
        const tChars = TAGLINE_DATA[t].text.split('')
        await scramble(
          tChars,
          upd => setTaglines(prev => {
            if (!prev) return prev
            const next = [...prev]
            next[t] = { ...next[t], chars: upd(next[t].chars) }
            return next
          }),
          35, 45, new Set([' ']),
        )

        if (cancelled) return
        if (t < TAGLINE_DATA.length - 1) await wait(100)
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  return (
    <section className="bg-[#FAF8F4] px-8" style={{ paddingTop: '20vh', paddingBottom: '4vh' }}>
      <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-end gap-12 md:gap-16">

        {/* ── Left: label + name ─────────────────────────────────── */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-10">
            Product designer · painter · writer
          </p>
          <h1
            aria-label="Sarpomaa Bempong"
            className="font-serif text-6xl sm:text-7xl lg:text-[7.5rem] text-[#2C2820] leading-[0.92] tracking-tight"
          >
            {nameChars === null
              ? <>Sarpomaa<br />Bempong</>
              : nameChars.map((c, i) => {
                  // Line break character: render <br /> once locked, nothing while pending
                  if (NAME_CHARS[i] === '\n') {
                    return c.locked ? <br key={i} /> : null
                  }
                  return (
                    <span key={i} aria-hidden="true" style={{ color: c.locked ? '#2C2820' : '#9B8E7E' }}>
                      {c.ch}
                    </span>
                  )
                })
            }
          </h1>
        </div>

        {/* ── Right: taglines ────────────────────────────────────── */}
        <div className="flex flex-col" style={{ gap: '10px', paddingBottom: '4px' }}>
          {(taglines === null ? TAGLINE_DATA.map((t, i) => ({ visible: true, text: t.text, idx: i })) : taglines.map((tl, i) => ({ ...tl, text: TAGLINE_DATA[i].text, idx: i }))).map((row, i) => {
            const Icon = ICONS[i]
            return (
              <div
                key={i}
                className="flex items-center gap-3"
                style={{
                  color:    '#7A6A5A',
                  fontSize: '13px',
                  opacity:  row.visible ? 1 : 0,
                }}
              >
                <Icon />
                <span aria-hidden="true">
                  {taglines === null
                    ? row.text
                    : (taglines[i].chars.map((c, j) => (
                        <span key={j} style={{ color: c.locked ? '#7A6A5A' : '#9B8E7E' }}>
                          {c.ch}
                        </span>
                      )))
                  }
                </span>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
