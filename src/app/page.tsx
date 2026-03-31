import Image from 'next/image'
import Link from 'next/link'
import Nav from './components/Nav'

const uxProjects = [
  {
    title: 'ReadNext',
    label: 'Product Design',
    year: '2025',
  },
  {
    title: 'FittGrad',
    label: 'Product Design',
    year: '2025',
  },
  {
    title: 'The Breathing Interface',
    label: 'Interaction Design',
    year: '2024',
  },
  {
    title: 'Nature in Abstraction',
    label: 'Visual Design',
    year: '2024',
  },
]

const paintings = [
  {
    title: 'The Waves',
    excerpt: 'The calming, rushing sound of the waves. The waves that wave away the bad and wave in the good we await.',
    image: '/paintings/waves.png',
  },
  {
    title: 'Mess in the Middle',
    excerpt: 'Sometimes, when you are looking at everything from the centre, it looks messy, with no way in or out.',
    image: '/paintings/Mess.png',
  },
  {
    title: 'Light',
    excerpt: 'There comes a time when we must be honest with ourselves and make tough decisions.',
    image: '/paintings/light.png',
  },
  {
    title: 'Symmetry of Calm',
    excerpt: 'Symmetry of Calm explores balance and reflection as conditions for stillness.',
    image: '/paintings/Calm.png',
  },
]

const stories = [
  {
    number: '01',
    title: 'Tomi, The Go-Between',
    date: 'Mar 2026',
    excerpt: 'I whispered a prayer before getting to work. I smiled at Otto when I was done and soon wished I hadn\'t.',
    href: 'https://writings.artbysarps.com',
  },
  {
    number: '02',
    title: 'The Elevator Experience',
    date: 'Mar 2026',
    excerpt: '"Kofi, is that you?" Ama said excitedly. "Excuse me, who are you, and why are you all over my man?"',
    href: 'https://writings.artbysarps.com',
  },
  {
    number: '03',
    title: 'The Winning Race',
    date: 'Dec 2025',
    excerpt: 'They say a book can change your life. Follow two lives — an ambitious young woman who has stopped dreaming, and an Uber driver looking to impact the world.',
    href: 'https://writings.artbysarps.com',
  },
]

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="bg-[#FAF8F4] flex flex-col px-8" style={{ paddingTop: '20vh', paddingBottom: '4vh' }}>
          <div className="max-w-6xl mx-auto w-full">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-10">
              Product designer · painter · writer
            </p>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-[7.5rem] text-[#2C2820] leading-[0.92] tracking-tight mb-10">
              Sarpomaa<br />Bempong
            </h1>
            <p className="text-base text-[#8C8278] max-w-sm leading-relaxed">
              Designing products. Painting worlds. Telling stories.
            </p>
          </div>
        </section>

        {/* ── UX Work Grid ─────────────────────────────────────── */}
        <section id="works" className="bg-[#FAF8F4] px-8 py-24">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-12">
              Selected Work
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E8E4E0]">
              {uxProjects.map((project) => (
                <div
                  key={project.title}
                  className="group bg-[#FAF8F4] p-10 flex flex-col justify-between min-h-[280px] cursor-pointer hover:bg-[#F0EDE8] transition-colors duration-300"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8C8278] mb-5">
                      {project.label}
                    </p>
                    <h2 className="font-serif text-3xl text-[#2C2820] group-hover:text-[#5C4D3C] transition-colors duration-300 leading-snug">
                      {project.title}
                    </h2>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8C8278]">{project.year}</span>
                    <span className="text-xs text-[#8C8278] group-hover:text-[#2C2820] transition-all duration-300 group-hover:translate-x-0.5">
                      View case study →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Transition Zone ───────────────────────────────────── */}
        {/*
          Long gradient zone — think dusk, not a light switch.
          Cream holds for the first ~30%, then dissolves slowly through
          warm dusk tones into deep midnight by the end.
          "The human beneath" sits in the heart of the dark half.
        */}
        <section
          id="transition-zone"
          className="relative flex items-center justify-center"
          style={{
            minHeight: '120vh',
            background: [
              'linear-gradient(to bottom,',
              '  #FAF8F4   0%,',   /* cream — holds */
              '  #E2E8F0  18%,',   /* cool silver */
              '  #B0BFCE  32%,',   /* pale blue-grey */
              '  #7A8FA3  44%,',   /* slate blue */
              '  #3D5470  55%,',   /* steel blue */
              '  #1A2E48  66%,',   /* dark navy */
              '  #0D1828  76%,',   /* near-midnight */
              '  #080C14  86%,',   /* midnight */
              '  #080C14 100%',    /* holds */
              ')',
            ].join('\n'),
          }}
        >
          <div className="text-center relative z-10 px-8">
            <div
              className="w-px h-20 mx-auto mb-12"
              style={{
                background: 'linear-gradient(to bottom, transparent, #4A3D52, #384868)',
              }}
            />
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#C8D8F0] tracking-tight">
              The human beneath
            </h2>
            <div
              className="w-px h-20 mx-auto mt-12"
              style={{
                background: 'linear-gradient(to bottom, #384868, #8AAAD8, transparent)',
              }}
            />
          </div>
        </section>

        {/* ── Paintings ─────────────────────────────────────────── */}
        {/* No hard edge — the transition zone already ends at #080C14 */}
        <section id="paintings" className="bg-[#080C14] px-8 pb-24 pt-0">
          <div className="max-w-6xl mx-auto">
            {/* Soft spacer so the label doesn't start right at the seam */}
            <div className="h-24" />
            <p className="text-xs uppercase tracking-[0.25em] text-[#384868] mb-12">
              Paintings
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#141E33] mb-10">
              {paintings.map((painting) => (
                <div
                  key={painting.title}
                  className="group relative overflow-hidden cursor-default"
                  style={{ height: '400px' }}
                >
                  <Image
                    src={painting.image}
                    alt={painting.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* dark gradient overlay at bottom for title readability */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(4,6,14,0.85) 0%, rgba(4,6,14,0.3) 45%, transparent 100%)',
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-serif text-2xl text-[#C8D8F0] group-hover:text-[#8AAAD8] transition-colors duration-300 leading-snug">
                      {painting.title}
                    </h3>
                    <p className="font-serif italic text-[#A0B8D8] text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 leading-relaxed max-w-xs">
                      {painting.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

            <Link
              href="/paintings"
              className="text-xs text-[#8AAAD8] hover:text-[#C8D8F0] transition-colors duration-200 uppercase tracking-widest w-fit"
            >
              View all paintings →
            </Link>
          </div>
        </section>

        {/* ── Fiction ───────────────────────────────────────────── */}
        <section id="writing" className="bg-[#080C14] px-8 py-24">
          <div className="max-w-6xl mx-auto border-t border-[#0D1525] pt-24">
            <p className="text-xs uppercase tracking-[0.25em] text-[#384868] mb-6">
              Fiction
            </p>
            <p className="text-[#384868] text-sm mb-20 max-w-md leading-relaxed">
              Short stories and longer fiction, published at{' '}
              <a
                href="https://writings.artbysarps.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8AAAD8] hover:text-[#C8D8F0] transition-colors duration-200"
              >
                writings.artbysarps.com
              </a>
              .
            </p>
            <div className="flex flex-col">
              {stories.map((story, i) => (
                <a
                  key={story.title}
                  href={story.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group py-10 flex flex-col gap-4 transition-opacity duration-200 hover:opacity-70 ${
                    i < stories.length - 1 ? 'border-b border-[#0D1525]' : ''
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <span className="text-xs text-[#384868] font-mono tabular-nums">
                      {story.number}
                    </span>
                    <span className="text-xs text-[#384868] uppercase tracking-widest">
                      {story.date}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#C8D8F0] group-hover:text-[#8AAAD8] transition-colors duration-300 leading-snug">
                    {story.title}
                  </h3>
                  <p className="font-serif italic text-[#384868] text-sm max-w-lg leading-relaxed">
                    {story.excerpt}
                  </p>
                  <span className="text-xs text-[#8AAAD8] uppercase tracking-widest group-hover:text-[#C8D8F0] transition-colors duration-200">
                    Read →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────────── */}
        <section className="bg-[#060A10] px-8 py-32">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#C8D8F0] mb-16 leading-snug">
              Let's build something.
            </h2>
            <div className="flex flex-col gap-5">
              <a
                href="mailto:hello@artbysarps.com"
                className="text-xs text-[#8AAAD8] hover:text-[#C8D8F0] transition-colors duration-200 uppercase tracking-widest w-fit"
              >
                Email
              </a>
              <a
                href="https://linkedin.com/in/sarpomaa-bempong"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#8AAAD8] hover:text-[#C8D8F0] transition-colors duration-200 uppercase tracking-widest w-fit"
              >
                LinkedIn
              </a>
              <a
                href="https://artbysarps.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#8AAAD8] hover:text-[#C8D8F0] transition-colors duration-200 uppercase tracking-widest w-fit"
              >
                artbysarps.com
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
