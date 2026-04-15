export const works = [
  { title: 'ReadNext',               slug: 'readnext' },
  { title: 'FittGrad',               slug: 'fittgrad' },
  { title: 'The Breathing Interface', slug: 'breathing-interface' },
]

export function getAdjacentWorks(slug: string) {
  const idx  = works.findIndex(w => w.slug === slug)
  const prev = works[(idx - 1 + works.length) % works.length]
  const next = works[(idx + 1) % works.length]
  return { prev, next }
}
