import Image from 'next/image'
import Nav from '../../components/Nav'

const geometricSeries = [
  { title: 'Squares', year: '2023', image: '/paintings/unrestrained/unrestrained-11.png' },
  { title: 'Circles', year: '2023', image: '/paintings/unrestrained/unrestrained-12.png' },
  { title: 'Diamonds', year: '2023', image: '/paintings/unrestrained/unrestrained-13.png' },
  { title: 'Prisms', year: '2023', image: '/paintings/unrestrained/unrestrained-14.png' },
  { title: 'Lattice', year: '2023', image: '/paintings/unrestrained/unrestrained-15.png' },
  { title: 'Planes', year: '2023', image: '/paintings/unrestrained/unrestrained-16.png' },
  { title: 'Rest', year: '2024', image: '/paintings/unrestrained/unrestrained-23.png' },
]

export default function GeometricSeriesPage() {
  return (
    <>
      <Nav forceDark />

      <main className="bg-[#080C14] min-h-screen">
        <section className="px-8 pt-40 pb-32">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[#384868] mb-4">
              Series
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#C8D8F0] mb-4 leading-tight">
              Geometric Series
            </h1>
            <p className="text-[#384868] text-sm max-w-2xl leading-relaxed mb-16">
              This section is a collection of work that explores the use of simple geometric shapes as a generative system. Each piece begins with a single shape and investigates how repetition, rotation, spacing, and color variation can produce a wide range of visual outcomes. The focus of this series was to understand how much could be achieved by working within a limited set of constraints. By returning to the same shape and applying consistent methods across pieces, the work examines how subtle shifts in form, orientation, and palette can transform perception and create complexity. Rather than treating each work as a standalone experiment, the pieces are intended to be read together as variations within the same system. All artwork was created digitally using the Procreate app for iPad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#141E33]">
              {geometricSeries.map((painting) => (
                <div
                  key={painting.title}
                  className="group relative overflow-hidden"
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
                      <p className="text-xs text-[#384868] mb-1 uppercase tracking-widest">
                        {painting.year}
                      </p>
                      <h2 className="font-serif text-2xl text-[#C8D8F0] group-hover:text-[#8AAAD8] transition-colors duration-300 leading-snug">
                        {painting.title}
                      </h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
