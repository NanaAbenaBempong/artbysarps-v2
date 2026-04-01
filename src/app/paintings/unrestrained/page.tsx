'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '../../components/Nav'

const images = Array.from({ length: 26 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return `/paintings/unrestrained/unrestrained-${n}.png`
})

export default function UnrestrainedPage() {
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected])

  return (
    <>
      <Nav forceDark />

      <main className="bg-[#080C14] min-h-screen">
        <section className="px-8 pt-40 pb-32">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/paintings"
              className="text-xs text-[#8AAAD8] hover:text-[#C8D8F0] transition-colors duration-200 uppercase tracking-widest block mb-16"
            >
              ← All paintings
            </Link>

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
                <button
                  key={src}
                  className="group relative overflow-hidden block cursor-pointer w-full"
                  style={{ height: '400px' }}
                  onClick={() => setSelected(src)}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0,0,0,0.92)',
          opacity: selected ? 1 : 0,
          pointerEvents: selected ? 'auto' : 'none',
        }}
        onClick={() => setSelected(null)}
      >
        <button
          className="absolute top-6 right-8 text-[#384868] hover:text-[#C8D8F0] transition-colors duration-200 text-2xl leading-none z-10"
          onClick={() => setSelected(null)}
          aria-label="Close"
        >
          ✕
        </button>
        {selected && (
          <div
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected}
              alt=""
              width={1200}
              height={1200}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                width: 'auto',
                height: 'auto',
                display: 'block',
              }}
              sizes="90vw"
            />
          </div>
        )}
      </div>
    </>
  )
}
