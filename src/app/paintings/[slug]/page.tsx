import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '../../components/Nav'

const paintings = [
  {
    slug: 'the-wood',
    title: 'The Wood',
    image: '/paintings/Wood.png',
    reflection: 'Out of the mundane and ordinary things can come the most beautiful creation or experience you can imagine. The tree\'s stem looks prosaic on the outside but often has an intricately beautiful pattern within. Every ordinary person you meet has a unique, beautiful pattern within. Be patient with them and find that beauty.',
    process: 'The Wood explores texture and movement as an abstract interpretation of growth. The piece emerged from a blank canvas using color, line, and distortion tools to experiment with flow and form. The process mirrors how wood, when examined beyond its surface, reveals layered patterns and quiet motion beneath.',
  },
  {
    slug: 'the-waves',
    title: 'The Waves',
    image: '/paintings/waves.png',
    reflection: 'The calming, rushing sound of the waves / The calming feel of the waves against our feet on shore / The waves that wave away the bad / And waves in the good we await / The waves that show the beauty of creation / The waves through which we see the other side of the ocean / The waves that make it possible to touch the far / The Waves / The calming, rushing sound of the waves',
    process: 'The Waves explores movement and rhythm as an abstract expression of sound and motion. A restrained color palette establishes a sense of calm, while the introduction of yellow introduces a subtle disturbance, reflecting how even tranquil environments carry moments of tension.',
  },
  {
    slug: 'mess-in-the-middle',
    title: 'Mess in the Middle',
    image: '/paintings/Mess.png',
    reflection: 'Sometimes, when you are looking at everything from the centre, it looks messy, with no way in or out. In those moments, take a step back — away from the centre and towards the edge. There, you will find some sanity and less mess. Pick them one after the other — you will be able to focus more and make sense of the messy blob.',
    process: 'Mess in the Middle is an abstraction of the Sun. It explores the relationship between distance, distortion, and perception. From a distance, the piece reads as a cohesive whole; up close, the center appears dense and chaotic. This tension reflects how moments of uncertainty often sit at the core of growth and understanding.',
  },
  {
    slug: 'light',
    title: 'Light',
    image: '/paintings/light.png',
    reflection: 'There comes a time when we must be honest with ourselves and make tough decisions. The real struggle lies in knowing which is the right decision at any given moment because sometimes, they both look perfect! Roll away the emotions, focus on the facts, and then choose. Don\'t forget, whatever the choice, it comes with consequences!',
    process: 'Light explores light as movement rather than illumination. The composition begins from an empty field, using layered lines and color to suggest light in motion — bending, intersecting, and shifting across space. By allowing lighter and darker areas to coexist, the work reflects how light is perceived through transition and direction, not stillness.',
  },
  {
    slug: 'fresh-start',
    title: 'Fresh Start',
    image: '/paintings/FreshStart.png',
    reflection: 'Life comes in phases, with different experiences, people, emotions and feelings, and many different things. Life is not stagnant, so no matter what you are going through, remember there is a chance to have a different and better tomorrow. Will you take the opportunity?',
    process: 'Fresh Start explores renewal through balance, repetition, and controlled transformation. The composition is built around a circular structure, using symmetry and layered color to suggest continuity rather than rupture. The abstraction emphasizes steadiness and restraint, positioning renewal as a measured process shaped by existing structure.',
  },
  {
    slug: 'hourglass',
    title: 'Hourglass',
    image: '/paintings/Hour_Glass.png',
    reflection: 'No matter where you are or what you are going through, time is moving. Don\'t rush and miss out on what life has for you, but don\'t sit around for too long mulling over what could have been. Get up, make a move, learn from it, and find joy in the midst of it. And when it ends, start over because time isn\'t going to sit still and wait for you.',
    process: 'Hourglass explores renewal through balance, repetition, and controlled transformation. The composition is built around a circular structure, using symmetry and layered color to suggest continuity. The abstraction emphasizes steadiness and restraint, positioning renewal as a measured process shaped by existing structure.',
  },
  {
    slug: 'symmetry-of-calm',
    title: 'Symmetry of Calm',
    image: '/paintings/Calm.png',
    reflection: 'Symmetry of Calm explores balance and reflection as conditions for stillness.',
    process: 'The composition is organized around mirrored forms and softened transitions, using symmetry to create a sense of visual equilibrium. The work reduces the scene to its structural qualities, allowing calm to emerge through proportion, repetition, and tonal restraint.',
  },
]

export function generateStaticParams() {
  return paintings.map((p) => ({ slug: p.slug }))
}

export default async function PaintingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const painting = paintings.find((p) => p.slug === slug)

  if (!painting) notFound()

  const isPoetry = painting.slug === 'the-waves'

  return (
    <>
      <Nav forceDark />

      <main className="bg-[#080C14] min-h-screen">
        <div className="flex flex-col md:flex-row">

          {/* ── Left: sticky image panel ──────────────────────────── */}
          <div
            className="w-full md:w-1/2 md:sticky md:top-0 md:h-screen flex items-center justify-center bg-[#080C14]"
          >
            <div className="relative w-full h-[60vw] md:h-full">
              <Image
                src={painting.image}
                alt={painting.title}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* ── Right: scrollable content ─────────────────────────── */}
          <div className="w-full md:w-1/2 px-8 md:px-12 pt-28 pb-32">
            <Link
              href="/paintings"
              className="text-xs text-[#8AAAD8] hover:text-[#C8D8F0] transition-colors duration-200 uppercase tracking-widest block mb-16"
            >
              ← Back to paintings
            </Link>

            <h1 className="font-serif text-4xl sm:text-5xl text-[#C8D8F0] mb-12 leading-tight">
              {painting.title}
            </h1>

            {isPoetry ? (
              <div className="mb-12">
                {painting.reflection.split(' / ').map((line, i) => (
                  <p
                    key={i}
                    className="font-serif italic text-[#8AAAD8] text-lg leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className="font-serif italic text-[#8AAAD8] text-lg leading-relaxed mb-12">
                {painting.reflection}
              </p>
            )}

            <div className="border-t border-[#0D1525] pt-10">
              <p className="text-xs uppercase tracking-[0.25em] text-[#384868] mb-5">
                Process
              </p>
              <p className="font-serif text-[#6A8AAC] text-base leading-relaxed">
                {painting.process}
              </p>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
