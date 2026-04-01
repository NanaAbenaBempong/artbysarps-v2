import Image from 'next/image'
import Nav from '../../components/Nav'

const images = Array.from({ length: 26 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return `/paintings/unrestrained/unrestrained-${n}.png`
})

export default function UnrestrainedPage() {
  return (
    <>
      <Nav forceDark />

      <main className="bg-[#080C14] min-h-screen">
        <section className="px-8 pt-40 pb-32">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[#384868] mb-4">
              Collection
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#C8D8F0] mb-4 leading-tight">
              Unrestrained
            </h1>
            <p className="text-[#384868] text-sm max-w-md leading-relaxed mb-16">
              A collection of my wandering mind, brought together to create art; unrestrained by timelines or deadlines.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#141E33]">
              {images.map((src) => (
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
          </div>
        </section>
      </main>
    </>
  )
}
