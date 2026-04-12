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

  // ── Music state ───────────────────────────────────────────────────────────
  const [tracks, setTracks]           = useState<Track[]>([])
  const [loadingMusic, setLoadingMusic] = useState(true)
  const [playingId, setPlayingId]     = useState<number | null>(null)
  const audioRef                      = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch('/api/music-previews')
      .then(r => r.json())
      .then(d => setTracks(d.tracks ?? []))
      .catch(() => {})
      .finally(() => setLoadingMusic(false))
  }, [])

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''  // release the resource
      audioRef.current = null
    }
  }

  function handleRecordEnter(track: Track) {
    if (!track.previewUrl) return
    stopAudio()
    // Route through our proxy so the browser never hits Apple's CORS-restricted CDN directly
    const proxyUrl = `/api/music-proxy?url=${encodeURIComponent(track.previewUrl)}`
    const audio = new Audio(proxyUrl)
    audio.volume = 0.5
    audio.play().catch(() => {})
    audioRef.current = audio
    setPlayingId(track.id)
  }

  function handleRecordLeave() {
    stopAudio()
    setPlayingId(null)
  }

  // Clean up on unmount
  useEffect(() => {
    return () => { stopAudio() }
  }, [])

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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {loadingMusic
                ? /* Placeholder skeletons while fetching */
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-4">
                      <div className="w-full aspect-square rounded-full bg-[#E8E4E0] animate-pulse" style={{ maxWidth: '160px' }} />
                      <div className="flex flex-col items-center gap-1 w-full" style={{ maxWidth: '160px' }}>
                        <div className="h-2.5 w-3/4 rounded bg-[#E8E4E0] animate-pulse" />
                        <div className="h-2 w-1/2 rounded bg-[#E8E4E0] animate-pulse" />
                      </div>
                    </div>
                  ))
                : tracks.map((track) => {
                    const isPlaying = playingId === track.id
                    return (
                      <a
                        key={track.id}
                        href={track.appleMusicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-4"
                        onMouseEnter={() => handleRecordEnter(track)}
                        onMouseLeave={handleRecordLeave}
                      >
                        {/* Vinyl disc with album art */}
                        <div
                          className="relative w-full aspect-square rounded-full bg-[#1A1A1A] flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-[1.03]"
                          style={{ maxWidth: '160px' }}
                        >
                          {/* Album art fills the full disc */}
                          {track.artwork ? (
                            <Image
                              src={track.artwork}
                              alt={track.name}
                              fill
                              className="object-cover rounded-full"
                              sizes="160px"
                            />
                          ) : null}

                          {/* Vinyl groove rings overlay */}
                          <div className="absolute inset-0 rounded-full border-[5px] border-black/20 pointer-events-none" />
                          <div className="absolute inset-[22%] rounded-full border-[3px] border-black/20 pointer-events-none" />

                          {/* Centre spindle hole */}
                          <div className="absolute w-[10%] h-[10%] rounded-full bg-[#1A1A1A]/80 pointer-events-none" />

                          {/* Playing indicator — subtle pulse ring */}
                          {isPlaying && (
                            <div className="absolute inset-0 rounded-full ring-2 ring-white/40 animate-ping pointer-events-none" />
                          )}
                        </div>

                        <div className="text-center w-full" style={{ maxWidth: '160px' }}>
                          <p className="text-xs text-[#2C2820] font-medium truncate">{track.name}</p>
                          <p className="text-xs text-[#8C8278] truncate">{track.artist}</p>
                        </div>
                      </a>
                    )
                  })
              }
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
