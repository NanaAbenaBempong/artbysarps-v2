import Image from 'next/image'
import Link from 'next/link'
import Nav from '../components/Nav'

const works = [
  {
    image: '/works/readnext/readnext-06.png',
    imageSide: 'left' as const,
    tag: 'PRODUCT DESIGN',
    year: '2025',
    title: 'ReadNext',
    description:
      "A personalized book discovery experience designed to help readers find their next great read \u2014 faster, easier, and with more joy.",
    linkLabel: 'View case study',
    href: '/works/readnext',
  },
  {
    image: '/works/fittgrad/fittgrad-hero.png',
    imageSide: 'right' as const,
    tag: 'PRODUCT DESIGN',
    year: '2025',
    title: 'FittGrad',
    description:
      "A fitness app designed around the unpredictable schedules of graduate students \u2014 adaptive, low-friction, and built for real academic life.",
    linkLabel: 'View case study',
    href: '/works/fittgrad',
  },
  {
    image: '/works/breathing_interface/The Breathing Interface_Hero.png',
    imageSide: 'left' as const,
    tag: 'INTERACTION DESIGN',
    year: '2025',
    title: 'The Breathing Interface',
    description:
      "A spatial UX exploration that responds to emotional states \u2014 designing calm into the interface itself.",
    linkLabel: 'View case study',
    href: '/works/breathing-interface',
  },
  {
    image: '/paintings/Wood.png',
    imageSide: 'right' as const,
    tag: 'VISUAL DESIGN \u00B7 PAINTING SERIES',
    year: '2024',
    title: 'Nature in Abstraction',
    description:
      "A collection of nature-inspired digital paintings exploring abstraction, texture, and the quiet language of the natural world.",
    linkLabel: 'View series',
    href: '/paintings',
  },
]

export default function WorksPage() {
  return (
    <>
      <Nav />

      <main className="bg-[#FAF8F4] min-h-screen pt-32 pb-24">
        <div className="max-w-[800px] mx-auto px-8">

          {/* ── Header ──────────────────────────────────────────────── */}
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-6">
            Selected Work
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-[#2C2820] mb-6 leading-tight">
            Works
          </h1>
          <p className="text-[#5C4D3C] text-lg leading-relaxed mb-10 max-w-xl">
            A selection of product design and interaction work — from research through to high-fidelity design.
          </p>
          <div className="border-t border-[#E8E4E0] mb-16" />

          {/* ── Work rows ───────────────────────────────────────────── */}
          <div className="flex flex-col">
            {works.map((work) => (
              <div key={work.title}>
                <Link
                  href={work.href}
                  className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-16 cursor-pointer group block"
                >

                  {/* Image */}
                  <div
                    className={`relative rounded-2xl overflow-hidden${
                      work.imageSide === 'left' ? ' md:order-first' : ' md:order-last'
                    }`}
                    style={{ height: '320px' }}
                  >
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>

                  {/* Text */}
                  <div
                    className={
                      work.imageSide === 'left' ? 'md:order-last' : 'md:order-first'
                    }
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#8C8278]">
                        {work.tag}
                      </p>
                      <span className="text-xs text-[#C4B8AE]">{work.year}</span>
                    </div>
                    <h2 className="font-serif text-3xl text-[#2C2820] mb-4 leading-snug">
                      {work.title}
                    </h2>
                    <p className="text-[#5C4D3C] text-base leading-relaxed mb-6">
                      {work.description}
                    </p>
                    <span className="text-xs uppercase tracking-widest text-[#8C8278] group-hover:text-[#2C2820] transition-colors duration-200">
                      {work.linkLabel} →
                    </span>
                  </div>

                </Link>
                <div className="border-t border-[#E8E4E0]" />
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  )
}
