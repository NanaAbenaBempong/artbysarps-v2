'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const paintings = [
  { title: 'Squares',  image: '/paintings/unrestrained/unrestrained-11.png' },
  { title: 'Circles',  image: '/paintings/unrestrained/unrestrained-12.png' },
  { title: 'Diamonds', image: '/paintings/unrestrained/unrestrained-13.png' },
  { title: 'Prisms',   image: '/paintings/unrestrained/unrestrained-14.png' },
  { title: 'Lattice',  image: '/paintings/unrestrained/unrestrained-15.png' },
  { title: 'Planes',   image: '/paintings/unrestrained/unrestrained-16.png' },
  { title: 'Rest',     image: '/paintings/unrestrained/unrestrained-23.png' },
]

export default function GeometricGallery({ limit = paintings.length }: { limit?: number }) {
  const [selected, setSelected] = useState<string | null>(null)
  const visible = paintings.slice(0, limit)

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#141E33]">
        {visible.map((painting) => (
          <button
            key={painting.title}
            className="group relative overflow-hidden block cursor-pointer text-left w-full"
            style={{ height: '400px' }}
            onClick={() => setSelected(painting.image)}
          >
            <Image
              src={painting.image}
              alt={painting.title}
              fill
              style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
              className="group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(4,6,14,0.9) 0%, rgba(4,6,14,0.35) 50%, transparent 100%)',
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="font-serif text-2xl text-[#C8D8F0] group-hover:text-[#8AAAD8] transition-colors duration-300 leading-snug">
                {painting.title}
              </h2>
            </div>
          </button>
        ))}
      </div>

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
            className="relative"
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
