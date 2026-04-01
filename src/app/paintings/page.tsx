import Image from 'next/image'
import Link from 'next/link'
import Nav from '../components/Nav'
import GeometricGallery from '../components/GeometricGallery'

const natureCollection = [
  {
    slug: 'the-wood',
    title: 'The Wood',
    image: '/paintings/Wood.png',
    excerpt: 'Out of the mundane and ordinary things can come the most beautiful creation.',
  },
  {
    slug: 'the-waves',
    title: 'The Waves',
    image: '/paintings/waves.png',
    excerpt: 'The waves that wave away the bad and wave in the good we await.',
  },
  {
    slug: 'mess-in-the-middle',
    title: 'Mess in the Middle',
    image: '/paintings/Mess.png',
    excerpt: 'Sometimes, when you are looking at everything from the centre, it looks messy.',
  },
  {
    slug: 'light',
    title: 'Light',
    image: '/paintings/light.png',
    excerpt: 'There comes a time when we must be honest with ourselves and make tough decisions.',
  },
  {
    slug: 'fresh-start',
    title: 'Fresh Start',
    image: '/paintings/FreshStart.png',
    excerpt: 'No matter what you are going through, there is a chance to have a different and better tomorrow.',
  },
  {
    slug: 'hourglass',
    title: 'Hourglass',
    image: '/paintings/Hour_Glass.png',
    excerpt: "Time isn't going to sit still and wait for you.",
  },
  {
    slug: 'symmetry-of-calm',
    title: 'Symmetry of Calm',
    image: '/paintings/Calm.png',
    excerpt: 'Symmetry of Calm explores balance and reflection as conditions for stillness.',
  },
]

export default function PaintingsPage() {
  return (
    <>
      <Nav forceDark />

      <main className="bg-[#080C14] min-h-screen">
        {/* ── Nature in Abstraction ──────────────────────────────── */}
        <section className="px-8 pt-40 pb-24">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[#384868] mb-4">
              Collection
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#C8D8F0] mb-4 leading-tight">
              Nature in Abstraction
            </h1>
            <p className="text-[#384868] text-sm max-w-md leading-relaxed mb-16">
              A collection of nature-inspired artwork that explores the representation of nature in an abstract way.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#141E33]">
              {natureCollection.map((painting) => (
                <Link
                  key={painting.title}
                  href={`/paintings/${painting.slug}`}
                  className="group relative overflow-hidden block cursor-pointer"
                  style={{ height: '400px' }}
                >
                  <Image
                    src={painting.image}
                    alt={painting.title}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* dark gradient for text legibility */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(4,6,14,0.9) 0%, rgba(4,6,14,0.35) 50%, transparent 100%)',
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-serif italic text-[#A0B8D8] text-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 leading-relaxed max-w-xs">
                        {painting.excerpt}
                      </p>
                      <h2 className="font-serif text-2xl text-[#C8D8F0] group-hover:text-[#8AAAD8] transition-colors duration-300 leading-snug">
                        {painting.title}
                      </h2>
                    </div>
                    <span className="text-xs text-[#8AAAD8] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                      View painting →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Geometric Series ──────────────────────────────────── */}
        <section className="px-8 pb-24">
          <div className="max-w-6xl mx-auto border-t border-[#0D1525] pt-24">
            <p className="text-xs uppercase tracking-[0.25em] text-[#384868] mb-4">
              Collection
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#C8D8F0] mb-4 leading-tight">
              Geometric Series
            </h2>
            <p className="text-[#384868] text-sm max-w-md leading-relaxed mb-16">
              A generative exploration of simple geometric shapes through repetition, rotation, spacing, and color variation.
            </p>

            <GeometricGallery />
          </div>
        </section>

        {/* ── Unrestrained ──────────────────────────────────────── */}
        <section className="px-8 pb-32">
          <div className="max-w-6xl mx-auto border-t border-[#0D1525] pt-24">
            <p className="text-xs uppercase tracking-[0.25em] text-[#384868] mb-4">
              Collection
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#C8D8F0] mb-4 leading-tight">
              Unrestrained
            </h2>
            <p className="text-[#384868] text-sm max-w-md leading-relaxed mb-16">
              A collection of my wandering mind, brought together to create art; unrestrained by timelines or deadlines.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#141E33] mb-10">
              {Array.from({ length: 6 }, (_, i) => {
                const n = String(i + 1).padStart(2, '0')
                return `/paintings/unrestrained/unrestrained-${n}.png`
              }).map((src) => (
                <div
                  key={src}
                  className="relative overflow-hidden"
                  style={{ height: '400px' }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>

            <Link
              href="/paintings/unrestrained"
              className="text-xs text-[#8AAAD8] hover:text-[#C8D8F0] transition-colors duration-200 uppercase tracking-widest w-fit"
            >
              View all paintings →
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
