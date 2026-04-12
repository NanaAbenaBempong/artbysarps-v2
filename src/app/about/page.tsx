'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Nav from '../components/Nav'
import type { Track } from '../api/music-previews/route'

// ── Section 4 hover items ─────────────────────────────────────────────────────
const notAtScreen = [
  { label: 'Reading',                             color: '#e8e4dc' },
  { label: 'Baking',                              color: '#f0e8dc' },
  { label: 'Sitting outside with fresh air and no agenda', color: '#dce8e0' },
  { label: 'Cat person',                          color: '#e8dce8' },
]

// ── Section 2 cards ───────────────────────────────────────────────────────────
const practices = [
  {
    label:   'Design',
    default: 'I design to reduce friction and build trust.',
    hover:   'Grounded in research. Shaped by empathy. Finished with care.',
    href:    null,
  },
  {
    label:   'Painting',
    default: 'I paint to think in colour and constraint.',
    hover:   'All in Procreate. Geometric series, abstract series, and everything in between.',
    href:    null,
  },
  {
    label:   'Writing',
    default: 'I write to sit with questions I haven\u2019t solved.',
    hover:   null, // rendered manually to include a link
    href:    'https://writings.artbysarps.com',
  },
]

// ── Section 3 tracks ──────────────────────────────────────────────────────────
// TODO: replace placeholder tracks with real ones
const tracks = [
  { track: 'Placeholder Track 1', artist: 'Artist 1', href: '#' },
  { track: 'Placeholder Track 2', artist: 'Artist 2', href: '#' },
  { track: 'Placeholder Track 3', artist: 'Artist 3', href: '#' },
  { track: 'Placeholder Track 4', artist: 'Artist 4', href: '#' },
]

const skills = [
  'Product Design',
  'UX/UI',
  'User Research',
  'Visual Design',
  'Digital Painting',
  'Design Systems',
  'Creative Writing',
  'Prototyping',
]

export default function AboutPage() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  return (
    <>
      <Nav />

      <main className="bg-[#FAF8F4] min-h-screen pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-8">

          {/* ── Section 1 — Bio ────────────────────────────────────────── */}
          <section className="mb-28">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-10">
              About
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2C2820] leading-tight mb-12 max-w-3xl">
              &ldquo;I&rsquo;m a storyteller. Everything else follows from that.&rdquo;
            </h1>

            <div className="max-w-2xl flex flex-col gap-6">
              <p className="text-base text-[#5C4D3C] leading-relaxed">
                I&rsquo;m Sarpomaa, a product designer, painter, and writer based in Boston.
                I design digital products that reduce friction and respect people&rsquo;s time,
                grounded in research and shaped by empathy. I paint in Procreate, exploring
                geometry, abstraction, and colour as their own kind of language. And I write
                stories that sit with questions I haven&rsquo;t figured out yet.
              </p>
              <p className="text-base text-[#5C4D3C] leading-relaxed">
                The three practices aren&rsquo;t separate. They borrow from each other constantly.
                Good design tells a story. A good painting has structure. Good writing, like good
                UX, knows what to leave out.
              </p>
            </div>
          </section>

          {/* ── Section 2 — The three practices ───────────────────────── */}
          <section className="mb-28">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-12">
              The Three Practices
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {practices.map((card) => (
                <div
                  key={card.label}
                  className="group border border-[#E8E4E0] rounded-2xl p-8 flex flex-col gap-4 min-h-[180px] justify-between"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8C8278]">
                    {card.label}
                  </p>

                  <div className="relative flex-1 flex items-end">
                    {/* Default line — fades out on hover */}
                    <p className="font-serif text-lg text-[#2C2820] leading-snug absolute inset-0 flex items-end transition-opacity duration-300 group-hover:opacity-0">
                      {card.default}
                    </p>

                    {/* Hover line — fades in */}
                    <div className="font-serif italic text-base text-[#5C4D3C] leading-relaxed absolute inset-0 flex items-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {card.label === 'Writing' ? (
                        <p>
                          Short stories and longer fiction at{' '}
                          <a
                            href="https://writings.artbysarps.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#5C4D3C] underline underline-offset-2 hover:text-[#2C2820] transition-colors duration-200"
                          >
                            writings.artbysarps.com
                          </a>
                        </p>
                      ) : (
                        <p>{card.hover}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Section 3 — Currently listening ───────────────────────── */}
          <section className="mb-28">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-12">
              Currently Listening
            </p>

            {/* TODO: replace placeholder tracks with real ones */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {tracks.map((item) => (
                <a
                  key={item.track}
                  href={item.href}
                  className="group flex flex-col items-center gap-4 hover:opacity-75 transition-opacity duration-200"
                >
                  {/* Vinyl disc */}
                  <div
                    className="w-full aspect-square rounded-full bg-[#1A1A1A] flex items-center justify-center relative overflow-hidden"
                    style={{ maxWidth: '160px' }}
                  >
                    {/* Grooves */}
                    <div className="absolute inset-0 rounded-full border-[6px] border-[#2a2a2a]" />
                    <div className="absolute inset-[20%] rounded-full border-[4px] border-[#2a2a2a]" />
                    <div className="absolute inset-[38%] rounded-full border-[3px] border-[#2a2a2a]" />
                    {/* Label centre */}
                    <div className="w-[28%] h-[28%] rounded-full bg-[#3a3a3a] flex items-center justify-center">
                      <div className="w-[20%] h-[20%] rounded-full bg-[#1A1A1A]" />
                    </div>
                  </div>

                  <div className="text-center w-full" style={{ maxWidth: '160px' }}>
                    <p className="text-xs text-[#2C2820] font-medium truncate">{item.track}</p>
                    <p className="text-xs text-[#8C8278] truncate">{item.artist}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ── Section 4 — When I'm not at a screen ──────────────────── */}
          {/* 'use client' directive at file top enables hover state here */}
          <section className="mb-28">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-12">
              When I&rsquo;m Not at a Screen
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
              {/* Left: list */}
              <div className="flex flex-col">
                {notAtScreen.map((item, i) => (
                  <div
                    key={item.label}
                    className={`py-5 cursor-default transition-colors duration-200 ${
                      i < notAtScreen.length - 1 ? 'border-b border-[#E8E4E0]' : ''
                    } ${i === 0 ? 'border-t border-[#E8E4E0]' : ''}`}
                    onMouseEnter={() => setHoveredItem(i)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <p className={`text-base transition-colors duration-200 ${
                      hoveredItem === i ? 'text-[#2C2820]' : 'text-[#5C4D3C]'
                    }`}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right: colour preview box */}
              <div className="hidden md:block sticky top-32">
                <div
                  className="w-full rounded-2xl flex items-center justify-center transition-colors duration-300"
                  style={{
                    height: '240px',
                    backgroundColor: hoveredItem !== null
                      ? notAtScreen[hoveredItem].color
                      : '#F0EDE8',
                  }}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8C8278]">
                    Photo coming soon
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 5 — Skills and availability ───────────────────── */}
          <section>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-10">
              Skills
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs uppercase tracking-[0.15em] text-[#5C4D3C] border border-[#E8E4E0] rounded-full px-4 py-2"
                >
                  {skill}
                </span>
              ))}
            </div>

            <p className="text-sm text-[#8C8278] leading-relaxed">
              Currently open to full-time roles and freelance collaborations.
            </p>
          </section>

        </div>
      </main>
    </>
  )
}
