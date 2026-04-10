const FALLBACKS = [
  "I whispered a prayer before getting to work.",
  "She had always believed that God spoke loudest in the quiet.",
  "He smiled at Otto when he was done and soon wished he hadn't.",
]

function randomFallback() {
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201c')
    .replace(/&#8221;/g, '\u201d')
    .replace(/&#8230;/g, '\u2026')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, '')
    .replace(/&[a-z]+;/gi, '')
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function extractSentences(text: string): string[] {
  const decoded = decodeEntities(text)
  // Split on sentence-ending punctuation followed by whitespace
  const raw = decoded.split(/(?<=[.!?])\s+/)
  return raw.filter(s => {
    const t = s.trim()
    return (
      t.length >= 40 &&
      t.length <= 120 &&
      // must contain at least 4 words
      t.split(/\s+/).length >= 4 &&
      // skip lines that are all-caps or look like nav/UI labels
      t !== t.toUpperCase() &&
      !/^(home|menu|about|contact|read more|continue reading|posted|tags|categories)/i.test(t)
    )
  })
}

async function tryWordPressApi(): Promise<string | null> {
  const res = await fetch(
    'https://writings.artbysarps.com/wp-json/wp/v2/posts?per_page=8&_fields=content',
    { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 0 } }
  )
  if (!res.ok) return null

  const posts: Array<{ content?: { rendered?: string } }> = await res.json()
  if (!Array.isArray(posts) || posts.length === 0) return null

  const allText = posts
    .map(p => stripTags(p.content?.rendered ?? ''))
    .join(' ')

  const sentences = extractSentences(allText)
  if (sentences.length === 0) return null

  return sentences[Math.floor(Math.random() * sentences.length)]
}

async function tryHomepageScrape(): Promise<string | null> {
  const res = await fetch('https://writings.artbysarps.com', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 0 },
  })
  if (!res.ok) return null

  const html = await res.text()
  // Extract only <p> tag content to avoid nav/header noise
  const pTags = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
  const text = pTags.map(m => stripTags(m[1])).join(' ')
  const sentences = extractSentences(text)
  if (sentences.length === 0) return null

  return sentences[Math.floor(Math.random() * sentences.length)]
}

export async function GET() {
  try {
    const fromApi = await tryWordPressApi()
    if (fromApi) return Response.json({ sentence: fromApi })
  } catch { /* fall through */ }

  try {
    const fromScrape = await tryHomepageScrape()
    if (fromScrape) return Response.json({ sentence: fromScrape })
  } catch { /* fall through */ }

  return Response.json({ sentence: randomFallback() })
}
