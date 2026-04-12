'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Nav from '../components/Nav'
import type { Track } from '../api/music-previews/route'

// ── Section 4 — When I'm not at a screen ─────────────────────────────────────
const notAtScreen = [
  {
    label:  'Reading',
    photos: [
      { src: '/about/reading/vanishing-half.jpg',  alt: 'The Vanishing Half' },
      { src: '/about/reading/notes-on-grief.jpg',  alt: 'Notes on Grief' },
    ],
  },
  {
    label:  'Baking',
    photos: [
      { src: '/about/baking/bread-loaves-and-rolls.jpg', alt: 'Bread loaves and rolls' },
      { src: '/about/baking/glazed-oat-cookies.jpg',     alt: 'Glazed oat cookies' },
      { src: '/about/baking/chocolate-cupcakes.jpg',     alt: 'Chocolate cupcakes' },
      { src: '/about/baking/purple-cake-front.jpg',      alt: 'Purple cake front' },
      { src: '/about/baking/purple-cake-side.jpg',       alt: 'Purple cake side' },
      { src: '/about/baking/wreath-rolls-closeup.jpg',   alt: 'Wreath rolls close-up' },
      { src: '/about/baking/wreath-rolls-wide.jpg',      alt: 'Wreath rolls wide' },
      { src: '/about/baking/caramel-layer-cake.jpg',     alt: 'Caramel layer cake' },
      { src: '/about/baking/cinnamon-rolls.jpg',         alt: 'Cinnamon rolls' },
    ],
  },
  {
    label:  'Out in nature',
    photos: [
      { src: '/about/nature/sunset-through-trees.jpg',  alt: 'Sunset through trees' },
      { src: '/about/nature/sunset-palm-beach.jpg',     alt: 'Sunset palm beach' },
      { src: '/about/nature/sunset-over-water.jpg',     alt: 'Sunset over water' },
      { src: '/about/nature/magenta-roses.jpg',         alt: 'Magenta roses' },
      { src: '/about/nature/peach-roses-path.jpg',      alt: 'Peach roses path' },
      { src: '/about/nature/peach-roses-closeup.jpg',   alt: 'Peach roses close-up' },
    ],
  },
  {
    label:  'Shooting shots',
    photos: [
      { src: '/about/shooting/pendant-lights-dark.jpg',       alt: 'Pendant lights in dark' },
      { src: '/about/shooting/spiral-staircase-colour.jpg',   alt: 'Spiral staircase colour' },
      { src: '/about/shooting/spiral-staircase-bw.jpg',       alt: 'Spiral staircase black and white' },
      { src: '/about/shooting/staircase-globes-daytime.jpg',  alt: 'Staircase globes daytime' },
      { src: '/about/shooting/staircase-globes-bw.jpg',       alt: 'Staircase globes black and white' },
      { src: '/about/shooting/dramatic-clouds.jpg',           alt: 'Dramatic clouds' },
      { src: '/about/shooting/seashell-on-beach.jpg',        alt: 'Seashell on beach' },
    ],
  },
  {
    label:  'Somewhere there is food',
    photos: [
      { src: '/about/food/rice-chicken-bowl.jpg',    alt: 'Rice chicken bowl' },
      { src: '/about/food/rice-chicken-bowl-2.jpg',  alt: 'Rice chicken bowl 2' },
      { src: '/about/food/noodles-dipping-sauce.jpg', alt: 'Noodles with dipping sauce' },
      { src: '/about/food/shrimp-fried-rice.jpg',    alt: 'Shrimp fried rice' },
      { src: '/about/food/chicken-wings.jpg',        alt: 'Chicken wings' },
      { src: '/about/food/waffles-with-syrup.jpg',   alt: 'Waffles with syrup' },
    ],
  },
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

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function AboutPage() {
  const [mounted, setMounted]         = useState(false)
  const [hoveredItem, setHoveredItem] = useState<number>(0)
  const [photoIndex, setPhotoIndex]   = useState(0)

  // Shuffled photo arrays — randomised once on mount, stable thereafter
  const [sections] = useState(() =>
    notAtScreen.map(s => ({ ...s, photos: shuffled(s.photos) }))
  )

  // Suppress hydration mismatch: hoveredItem-driven class names and the
  // carousel differ between server and client renders.
  // Only apply interactive state after mount so both renders start identically.
  useEffect(() => { setMounted(true) }, [])

  const activeHover = mounted ? hoveredItem : 0

  function handleSectionEnter(i: number) {
    if (i !== hoveredItem) {
      setHoveredItem(i)
      setPhotoIndex(0)
    }
  }

  // Auto-advance slideshow — resets whenever the active section changes
  useEffect(() => {
    const photos = sections[activeHover].photos
    if (photos.length <= 1) return
    const id = setInterval(() => {
      setPhotoIndex(idx => (idx + 1) % photos.length)
    }, 2000)
    return () => clearInterval(id)
  }, [activeHover, sections])

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
                    onMouseEnter={() => handleSectionEnter(i)}
                  >
                    <p className={`text-base transition-colors duration-200 ${
                      activeHover === i ? 'text-[#2C2820]' : 'text-[#5C4D3C]'
                    }`}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right: auto-advancing slideshow for the active category */}
              <div className="hidden md:block sticky top-32">
                {(() => {
                  const photos = notAtScreen[activeHover].photos
                  return (
                    <div className="flex flex-col gap-4">
                      {/* Frame — stacked images crossfade via opacity */}
                      <div
                        className="relative w-full rounded-2xl overflow-hidden"
                        style={{ height: '380px', background: '#F5F3EF' }}
                      >
                        {photos.map((photo, idx) => (
                          <div
                            key={photo.src}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{ opacity: idx === photoIndex ? 1 : 0 }}
                          >
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              className="object-contain"
                              sizes="(max-width: 1280px) 50vw, 580px"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Dot indicators */}
                      {photos.length > 1 && (
                        <div className="flex justify-center gap-1.5">
                          {photos.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setPhotoIndex(i)}
                              aria-label={`Photo ${i + 1}`}
                              className={`rounded-full transition-all duration-200 ${
                                i === photoIndex
                                  ? 'w-4 h-1.5 bg-[#5C4D3C]'
                                  : 'w-1.5 h-1.5 bg-[#C8C0B8]'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}
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
