export interface Track {
  id: number
  name: string
  artist: string
  artwork: string
  previewUrl: string | null
  appleMusicUrl: string
}

const TRACK_IDS = [1884034849, 1731976525, 1870986714, 1861369699]

export async function GET() {
  try {
    const ids = TRACK_IDS.join(',')
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${ids}`,
      { next: { revalidate: 3600 } },
    )

    if (!res.ok) throw new Error(`iTunes responded ${res.status}`)

    const json = await res.json()
    const results: unknown[] = json.results ?? []

    const tracks: Track[] = TRACK_IDS.map((id) => {
      const item = results.find(
        (r): r is Record<string, unknown> =>
          typeof r === 'object' && r !== null && (r as Record<string, unknown>).trackId === id,
      )

      if (!item) {
        return {
          id,
          name:          'Unknown Track',
          artist:        'Unknown Artist',
          artwork:       '',
          previewUrl:    null,
          appleMusicUrl: 'https://music.apple.com',
        }
      }

      const artwork = typeof item.artworkUrl100 === 'string'
        ? item.artworkUrl100.replace('100x100', '400x400')
        : ''

      return {
        id,
        name:          typeof item.trackName     === 'string' ? item.trackName     : 'Unknown Track',
        artist:        typeof item.artistName    === 'string' ? item.artistName    : 'Unknown Artist',
        artwork,
        previewUrl:    typeof item.previewUrl    === 'string' ? item.previewUrl    : null,
        appleMusicUrl: typeof item.trackViewUrl  === 'string' ? item.trackViewUrl  : 'https://music.apple.com',
      }
    })

    return Response.json({ tracks })
  } catch (err) {
    console.error('music-previews error:', err)
    // Return placeholder data so the UI still renders
    const fallback: Track[] = TRACK_IDS.map((id) => ({
      id,
      name:          'Track unavailable',
      artist:        '—',
      artwork:       '',
      previewUrl:    null,
      appleMusicUrl: 'https://music.apple.com',
    }))
    return Response.json({ tracks: fallback }, { status: 200 })
  }
}
