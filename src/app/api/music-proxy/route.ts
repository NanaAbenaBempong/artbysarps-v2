import { type NextRequest } from 'next/server'

const ALLOWED_HOST = 'audio-ssl.itunes.apple.com'

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('url')

  if (!raw) {
    return new Response('Missing url parameter', { status: 400 })
  }

  let target: URL
  try {
    target = new URL(raw)
  } catch {
    return new Response('Invalid url parameter', { status: 400 })
  }

  // Only proxy Apple's audio CDN — reject anything else
  if (target.hostname !== ALLOWED_HOST) {
    return new Response('URL not allowed', { status: 403 })
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })

    if (!upstream.ok) {
      return new Response('Upstream fetch failed', { status: upstream.status })
    }

    const contentType = upstream.headers.get('Content-Type') ?? 'audio/mp4'

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new Response('Proxy error', { status: 502 })
  }
}
