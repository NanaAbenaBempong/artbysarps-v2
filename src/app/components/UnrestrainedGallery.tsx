'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const images = Array.from({ length: 26 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return `/paintings/unrestrained/unrestrained-${n}.png`
})

export default function UnrestrainedGallery() {
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (!selected) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected])

  return (
    <>
      <div style={{ columns: 2, columnGap: '12px' }}>
        {images.map((src) => (
          <div
            key={src}
            className="break-inside-avoid cursor-pointer"
            style={{ marginBottom: '12px' }}
            onClick={() => setSelected(src)}
          >
            <Image
              src={src}
              alt=""
              width={600}
              height={800}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative"
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selected}
              alt=""
              width={1200}
              height={1600}
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
        </div>
      )}
    </>
  )
}
