'use client'

import { useState, useEffect } from 'react'
import { Laptop, Paintbrush, Feather } from 'lucide-react'

// ── Constants ─────────────────────────────────────────────────────────────────

const AVAILABILITY = [
  'Open to full-time roles',
  'Open to networking',
  'Open to coffee chats',
  'Open to collaborations',
]

// Space at index 8 snaps instantly — no scramble
const NAME_CHARS   = 'Sarpomaa Bempong'.split('')
const NAME_INSTANT = new Set([' '])

const TAGLINE_DATA = [
  { text: 'Designing products' },
  { text: 'Painting worlds' },
  { text: 'Telling stories' },
]

const POOL = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789@#$%&!'

type CS = { ch: string; locked: boolean }

const ICONS = [
  () => <Laptop    size={16} color="#7A6A5A" aria-hidden="true" />,
  () => <Paintbrush size={16} color="#7A6A5A" aria-hidden="true" />,
  () => <Feather   size={16} color="#7A6A5A" aria-hidden="true" />,
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function HeroSection() {
  // null = SSR / pre-mount → render static content to avoid hydration mismatch
  const [nameChars, setNameChars] = useState<CS[] | null>(null)
  const [taglines,  setTaglines]  = useState<Array<{ visible: boolean; chars: CS[] }> | null>(null)

  const [availIdx,     setAvailIdx]     = useState(0)
  const [availVisible, setAvailVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setAvailVisible(false)
      setTimeout(() => {
        setAvailIdx(i => (i + 1) % AVAILABILITY.length)
        setAvailVisible(true)
      }, 300)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false

    setNameChars(NAME_CHARS.map(() => ({ ch: '', locked: false })))
    setTaglines(TAGLINE_DATA.map(t => ({
      visible: false,
      chars: t.text.split('').map(() => ({ ch: '', locked: false })),
    })))

    const wait = (ms: number) => new Promise<void>(res => setTimeout(res, ms))

    async function scramble(
      chars:     string[],
      setSlice:  (upd: (prev: CS[]) => CS[]) => void,
      flickerMs: number,
      gapMs:     number,
      instant:   Set<string>,
    ) {
      for (let i = 0; i < chars.length; i++) {
        if (cancelled) return
        const actual = chars[i]

        if (instant.has(actual)) {
          setSlice(prev => { const n = [...prev]; n[i] = { ch: actual, locked: true }; return n })
        } else {
          const flickers = 4 + Math.floor(Math.random() * 2)
          for (let f = 0; f < flickers; f++) {
            if (cancelled) return
            const rand = POOL[Math.floor(Math.random() * POOL.length)]
            setSlice(prev => { const n = [...prev]; n[i] = { ch: rand, locked: false }; return n })
            await wait(flickerMs)
          }
          if (cancelled) return
          setSlice(prev => { const n = [...prev]; n[i] = { ch: actual, locked: true }; return n })
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

      // Step 2 — taglines one at a time
      for (let t = 0; t < TAGLINE_DATA.length; t++) {
        if (cancelled) return

        setTaglines(prev => {
          if (!prev) return prev
          const next = [...prev]
          next[t] = { ...next[t], visible: true }
          return next
        })

        await scramble(
          TAGLINE_DATA[t].text.split(''),
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
    <section className="bg-[#FAF8F4] px-8" style={{ paddingTop: '14vh', paddingBottom: '3.5vh' }}>
      <div className="max-w-6xl mx-auto w-full">

        {/* Label */}
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-8">
          Product designer · painter · writer
        </p>

        {/* Name — single line, fluid size */}
        <h1
          aria-label="Sarpomaa Bempong"
          className="font-serif text-[#2C2820] leading-[0.92] tracking-tight mb-10"
          style={{ fontSize: 'clamp(56px, 8vw, 96px)' }}
        >
          {nameChars === null
            ? 'Sarpomaa Bempong'
            : nameChars.map((c, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  style={{ color: c.locked ? '#2C2820' : '#9B8E7E' }}
                >
                  {c.ch}
                </span>
              ))
          }
        </h1>

        {/* Taglines — single row */}
        <div className="flex flex-wrap items-center" style={{ gap: '32px' }}>
          {TAGLINE_DATA.map((t, i) => {
            const Icon    = ICONS[i]
            const visible = taglines === null ? true : taglines[i].visible
            const chars   = taglines?.[i].chars ?? null

            return (
              <div
                key={i}
                className="flex items-center gap-2"
                style={{ color: '#7A6A5A', fontSize: '15px', opacity: visible ? 1 : 0 }}
              >
                <Icon />
                <span aria-hidden="true">
                  {chars === null
                    ? t.text
                    : chars.map((c, j) => (
                        <span key={j} style={{ color: c.locked ? '#7A6A5A' : '#9B8E7E' }}>
                          {c.ch}
                        </span>
                      ))
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
