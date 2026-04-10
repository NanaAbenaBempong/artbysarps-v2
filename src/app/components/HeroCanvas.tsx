'use client'

import { useEffect, useRef } from 'react'

const FALLBACKS = [
  "I whispered a prayer before getting to work.",
  "She had always believed that God spoke loudest in the quiet.",
  "He smiled at Otto when he was done and soon wished he hadn't.",
]

// Three palettes — each paired with the frame at the same index
const PALETTES: string[][] = [
  ['#c17a3a', '#d4a853', '#8a6a2a', '#e8c87a'], // warm earthy  (frame 0)
  ['#3a6a8a', '#4a5a7a', '#6a4a8a', '#2a4a6a'], // cool moody   (frame 1)
  ['#8a2a2a', '#c84a2a', '#f5e6c8', '#6a2a1a'], // bold contrast (frame 2)
]

// Primitive types — coords as fractions of CW (x/w) and CH (y/h); circle.r is fraction of CW
type Prim =
  | { k: 'rect';   x: number; y: number; w: number; h: number }
  | { k: 'circle'; cx: number; cy: number; r: number }
  | { k: 'line';   x1: number; y1: number; x2: number; y2: number }

// ── Three wireframe frames ────────────────────────────────────────────────────

const FRAMES: Prim[][] = [
  // Frame 0 — Mobile App
  [
    { k: 'rect',   x: 0.08, y: 0.04, w: 0.84, h: 0.92 }, // outer frame
    { k: 'rect',   x: 0.08, y: 0.04, w: 0.84, h: 0.06 }, // status bar
    { k: 'rect',   x: 0.12, y: 0.14, w: 0.76, h: 0.16 }, // hero / header block
    { k: 'rect',   x: 0.12, y: 0.34, w: 0.35, h: 0.22 }, // left card
    { k: 'rect',   x: 0.52, y: 0.34, w: 0.35, h: 0.22 }, // right card
    { k: 'rect',   x: 0.12, y: 0.60, w: 0.76, h: 0.10 }, // list item
    { k: 'rect',   x: 0.08, y: 0.84, w: 0.84, h: 0.12 }, // bottom nav bar
  ],
  // Frame 1 — Browser Window
  [
    { k: 'rect',   x: 0.04, y: 0.05,  w: 0.92, h: 0.90 },           // outer frame
    { k: 'rect',   x: 0.04, y: 0.05,  w: 0.92, h: 0.10 },           // title bar
    { k: 'circle', cx: 0.12, cy: 0.100, r: 0.018 },                  // traffic dot 1
    { k: 'circle', cx: 0.18, cy: 0.100, r: 0.018 },                  // traffic dot 2
    { k: 'circle', cx: 0.24, cy: 0.100, r: 0.018 },                  // traffic dot 3
    { k: 'rect',   x: 0.30, y: 0.065, w: 0.60, h: 0.05 },           // address bar
    { k: 'line',   x1: 0.04, y1: 0.155, x2: 0.96, y2: 0.155 },      // chrome divider
    { k: 'rect',   x: 0.08, y: 0.22,  w: 0.52, h: 0.060 },          // page heading
    { k: 'rect',   x: 0.08, y: 0.33,  w: 0.74, h: 0.028 },          // body line 1
    { k: 'rect',   x: 0.08, y: 0.375, w: 0.65, h: 0.028 },          // body line 2
    { k: 'rect',   x: 0.08, y: 0.420, w: 0.46, h: 0.028 },          // body line 3
    { k: 'rect',   x: 0.08, y: 0.50,  w: 0.46, h: 0.35 },           // media block
    { k: 'rect',   x: 0.60, y: 0.50,  w: 0.32, h: 0.13 },           // sidebar card 1
    { k: 'rect',   x: 0.60, y: 0.67,  w: 0.32, h: 0.13 },           // sidebar card 2
  ],
  // Frame 2 — Card / Component
  [
    { k: 'rect',   x: 0.08, y: 0.06, w: 0.84, h: 0.88 },            // card frame
    { k: 'circle', cx: 0.21, cy: 0.21, r: 0.075 },                   // avatar circle
    { k: 'rect',   x: 0.34, y: 0.14, w: 0.50, h: 0.045 },           // name / heading
    { k: 'rect',   x: 0.34, y: 0.21, w: 0.35, h: 0.030 },           // subheading
    { k: 'line',   x1: 0.08, y1: 0.34, x2: 0.92, y2: 0.34 },        // section divider
    { k: 'rect',   x: 0.12, y: 0.40, w: 0.76, h: 0.028 },           // body line 1
    { k: 'rect',   x: 0.12, y: 0.45, w: 0.76, h: 0.028 },           // body line 2
    { k: 'rect',   x: 0.12, y: 0.50, w: 0.54, h: 0.028 },           // body line 3 (short)
    { k: 'rect',   x: 0.12, y: 0.59, w: 0.22, h: 0.055 },           // tag 1
    { k: 'rect',   x: 0.37, y: 0.59, w: 0.22, h: 0.055 },           // tag 2
    { k: 'rect',   x: 0.28, y: 0.74, w: 0.44, h: 0.09 },            // button
  ],
]

// ── Splash geometry types ─────────────────────────────────────────────────────
interface BlobPt    { x: number; y: number }
interface Blob      { cx: number; cy: number; pts: BlobPt[]; bottomY: number; color: string; opacity: number; dripMaxY: number }
interface SpatterLn { ox: number; oy: number; angle: number; length: number; lw: number; dotR: number; opacity: number; color: string; delay: number }
interface SatDrop   { x: number; y: number; r: number; color: string; delay: number }
interface Splash    { blobs: Blob[]; lines: SpatterLn[]; droplets: SatDrop[] }

async function fetchSentence(): Promise<string> {
  try {
    const res = await fetch('/api/story-excerpt')
    if (!res.ok) throw new Error()
    const data = await res.json()
    if (typeof data.sentence === 'string' && data.sentence.length > 0) return data.sentence
    throw new Error()
  } catch {
    return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
  }
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let running = true
    let rafId = 0
    const dpr = window.devicePixelRatio || 1
    let CW = 0
    let CH = 0

    // ── Setup ─────────────────────────────────────────────────────
    function setup() {
      const rect = canvas!.getBoundingClientRect()
      CW = rect.width
      CH = rect.height
      canvas!.width  = Math.round(CW * dpr)
      canvas!.height = Math.round(CH * dpr)
      // canvas.width resets the transform — re-apply DPR scale
      canvas!.getContext('2d')!.scale(dpr, dpr)
    }
    setup()

    const ctx = canvas.getContext('2d')!

    // ── Timings (ms) — unchanged ──────────────────────────────────
    const DRAW_DUR  = 2200
    const SHAKE_DUR = 450
    const BURST_DUR = 750
    const CHAR_MS   = 55
    const HOLD_DUR  = 1600
    const FADE_DUR  = 900

    // ── State ─────────────────────────────────────────────────────
    type Phase = 'draw' | 'shake' | 'burst' | 'type' | 'hold' | 'fade'
    let phase: Phase = 'draw'
    let phaseStart  = 0
    let sentence    = ''
    let splash: Splash | null = null
    let nextSentence = ''
    let prefetching  = false
    let cycleIndex   = 0   // 0 → 1 → 2 → 0 … incremented on each fade→draw

    // ── Primitive drawing ─────────────────────────────────────────

    function drawPrimAt(prim: Prim, progress: number) {
      if (prim.k === 'rect') {
        const x = prim.x * CW, y = prim.y * CH, w = prim.w * CW, h = prim.h * CH
        const perim = 2 * (w + h)
        ctx.save()
        ctx.setLineDash([perim, perim])
        ctx.lineDashOffset = perim * (1 - progress)
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.stroke()
        ctx.restore()
      } else if (prim.k === 'circle') {
        const cx = prim.cx * CW, cy = prim.cy * CH, r = prim.r * CW
        ctx.beginPath()
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * progress)
        ctx.stroke()
      } else if (prim.k === 'line') {
        const x1 = prim.x1 * CW, y1 = prim.y1 * CH
        const x2 = prim.x2 * CW, y2 = prim.y2 * CH
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress)
        ctx.stroke()
      }
    }

    function drawFrame(totalProgress: number) {
      ctx.strokeStyle = '#8C8278'
      ctx.lineWidth = 1
      const prims = FRAMES[cycleIndex % 3]
      const N = prims.length
      for (let i = 0; i < N; i++) {
        const start = i / N
        const end   = (i + 1) / N
        const p = Math.max(0, Math.min(1, (totalProgress - start) / (end - start)))
        if (p > 0) drawPrimAt(prims[i], p)
      }
    }

    // ── Paint splatter ────────────────────────────────────────────

    function makeBlobPts(cx: number, cy: number, baseR: number, N: number): BlobPt[] {
      const pts: BlobPt[] = []
      const step = (2 * Math.PI) / N
      for (let i = 0; i < N; i++) {
        const angle = step * i + (Math.random() - 0.5) * step * 0.55
        const r     = baseR * (0.50 + Math.random() * 0.85) // 50–135% of baseR
        pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) })
      }
      return pts
    }

    function buildSplash() {
      const colors = PALETTES[cycleIndex % 3]
      const D  = Math.min(CW, CH) // reference dimension
      const ox = CW * 0.50
      const oy = CH * 0.50

      // ── Blobs: 1 dominant central blob + 2–3 smaller overlapping secondaries ──
      const blobs: Blob[] = []
      const mainColor = colors[Math.floor(Math.random() * colors.length)]

      // Main blob — large, slightly off-centre, full opacity
      const mainCx  = ox + (Math.random() - 0.5) * D * 0.06
      const mainCy  = oy + (Math.random() - 0.5) * D * 0.06
      const mainR   = D * (0.168 + Math.random() * 0.048)  // 20% bigger: ~60–78 px → width ~112–144 px
      const mainPts = makeBlobPts(mainCx, mainCy, mainR, 12 + Math.floor(Math.random() * 3))
      blobs.push({
        cx: mainCx, cy: mainCy, pts: mainPts,
        bottomY: Math.max(...mainPts.map(p => p.y)),
        color: mainColor, opacity: 1,
        dripMaxY: D * (0.08 + Math.random() * 0.10),
      })

      // Secondary blobs — smaller, overlapping the main blob, slightly transparent
      const secCount = 2 + Math.floor(Math.random() * 2)  // 2–3
      for (let i = 0; i < secCount; i++) {
        // Cluster tightly around the main blob centre
        const cx    = mainCx + (Math.random() - 0.5) * mainR * 1.2
        const cy    = mainCy + (Math.random() - 0.5) * mainR * 1.2
        const baseR = D * (0.06 + Math.random() * 0.04)   // ~22–36 px
        const pts   = makeBlobPts(cx, cy, baseR, 10 + Math.floor(Math.random() * 4))
        blobs.push({
          cx, cy, pts,
          bottomY:  Math.max(...pts.map(p => p.y)),
          color:    colors[Math.floor(Math.random() * colors.length)],
          opacity:  0.65 + Math.random() * 0.25,   // 0.65–0.90
          dripMaxY: i === 0 ? D * (0.06 + Math.random() * 0.08) : 0,
        })
      }

      // ── Spatter lines — exactly 16, explosion-angle distribution ──
      const lines: SpatterLn[] = []
      const explAngle = Math.random() * Math.PI * 2  // random explosion direction each burst
      const deg = Math.PI / 180

      // Helper: build one line spec and push it
      function mkLine(angle: number, length: number, dotR: number) {
        lines.push({
          ox: ox, oy: oy,
          angle,
          length,
          lw:      0.8 + Math.random() * 1.2,   // 0.8–2.0
          opacity: 0.5 + Math.random() * 0.5,   // 0.5–1.0
          dotR,
          color:   colors[Math.floor(Math.random() * colors.length)],
          delay:   0,
        })
      }

      // Lines 1–4: tight forward cluster, long
      for (let i = 0; i < 4; i++) {
        mkLine(
          explAngle + (Math.random() * 50 - 25) * deg,
          200 + Math.random() * 40,
          6 + Math.random() * 6,
        )
      }
      // Lines 5–6: wider forward cluster, medium
      for (let i = 0; i < 2; i++) {
        mkLine(
          explAngle + (Math.random() * 80 - 40) * deg,
          90 + Math.random() * 40,
          4 + Math.random() * 3,
        )
      }
      // Lines 7–9: opposite direction cluster, medium
      for (let i = 0; i < 3; i++) {
        mkLine(
          explAngle + Math.PI + (Math.random() * 60 - 30) * deg,
          90 + Math.random() * 40,
          4 + Math.random() * 3,
        )
      }
      // Lines 10–12: fully random, short
      for (let i = 0; i < 3; i++) {
        mkLine(
          Math.random() * Math.PI * 2,
          30 + Math.random() * 30,
          2 + Math.random() * 2,
        )
      }
      // Lines 13–14: fully random, medium-length
      for (let i = 0; i < 2; i++) {
        mkLine(
          Math.random() * Math.PI * 2,
          90 + Math.random() * 30,
          2 + Math.random() * 2,
        )
      }
      // Lines 15–16: fully random, tiny flicks
      for (let i = 0; i < 2; i++) {
        mkLine(
          Math.random() * Math.PI * 2,
          10 + Math.random() * 10,
          1.5,
        )
      }

      const droplets: SatDrop[] = []   // endpoint droplets live on lines; no satellites
      splash = { blobs, lines, droplets }
    }

    function drawSplash(t: number) {
      if (!splash) return
      ctx.save()

      // Fully opaque for first 45% of burst, then fade to 0
      const alpha = t < 0.45 ? 1.0 : Math.max(0, 1.0 - (t - 0.45) / 0.55)
      ctx.globalAlpha = alpha

      // ── Blobs — cubic ease-out burst over first 22% of t ──────────
      const blobS = 1 - Math.pow(1 - Math.min(t / 0.22, 1), 3)

      for (const blob of splash.blobs) {
        // Scale control pts from blob centre
        const pts = blob.pts.map(p => ({
          x: blob.cx + (p.x - blob.cx) * blobS,
          y: blob.cy + (p.y - blob.cy) * blobS,
        }))
        const N = pts.length

        ctx.globalAlpha = alpha * blob.opacity
        ctx.fillStyle = blob.color
        ctx.beginPath()
        ctx.moveTo((pts[N-1].x + pts[0].x) / 2, (pts[N-1].y + pts[0].y) / 2)
        for (let i = 0; i < N; i++) {
          const c = pts[i], n = pts[(i + 1) % N]
          ctx.quadraticCurveTo(c.x, c.y, (c.x + n.x) / 2, (c.y + n.y) / 2)
        }
        ctx.closePath()
        ctx.fill()

        // Drip — grows from t=0.25, tip is an elongated teardrop
        if (blob.dripMaxY > 0 && t > 0.25) {
          const dripLen  = blob.dripMaxY * Math.min((t - 0.25) / 0.40, 1)
          const dripTopY = blob.cy + (blob.bottomY - blob.cy) * blobS
          if (dripLen > 1) {
            const tipY = dripTopY + dripLen
            const tipR = 3 + dripLen * 0.045
            ctx.strokeStyle = blob.color
            ctx.lineWidth   = 2
            ctx.lineCap     = 'round'
            ctx.beginPath()
            ctx.moveTo(blob.cx, dripTopY)
            ctx.lineTo(blob.cx, tipY)
            ctx.stroke()
            ctx.fillStyle = blob.color
            ctx.save()
            ctx.translate(blob.cx, tipY)
            ctx.scale(1, 1.55)
            ctx.beginPath()
            ctx.arc(0, 0, tipR, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          }
        }
        ctx.globalAlpha = alpha  // restore for next blob and subsequent elements
      }

      // ── Spatter lines — all extend simultaneously over 0.4 s ────────
      // 0.4s / BURST_DUR(0.75s) = 0.533 of burst t
      const LINE_DUR = 0.533
      ctx.lineCap = 'round'
      for (const line of splash.lines) {
        const lineT = Math.min(1, t / LINE_DUR)
        if (lineT <= 0) continue
        const len  = line.length * lineT
        const endX = line.ox + Math.cos(line.angle) * len
        const endY = line.oy + Math.sin(line.angle) * len

        ctx.globalAlpha = alpha * line.opacity
        ctx.strokeStyle = line.color
        ctx.lineWidth   = line.lw
        ctx.beginPath()
        ctx.moveTo(line.ox, line.oy)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        // Droplet travels with the tip from the moment the line starts moving
        if (line.dotR > 0) {
          ctx.fillStyle = line.color
          ctx.beginPath()
          ctx.arc(endX, endY, line.dotR, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = alpha
      }

      ctx.restore() // restores globalAlpha, lineWidth, lineCap, etc.
    }

    // ── Text helpers — unchanged ──────────────────────────────────

    function wrapText(text: string): string[] {
      const fontSize = Math.min(CW * 0.065, 20)
      ctx.font = `italic ${fontSize}px Georgia, serif`
      const maxW  = CW * 0.85
      const words = text.split(' ')
      const lines: string[] = []
      let cur = ''
      for (const word of words) {
        const test = cur ? `${cur} ${word}` : word
        if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = word }
        else cur = test
      }
      if (cur) lines.push(cur)
      return lines
    }

    function drawText(text: string, alpha: number, cursor: boolean, now: number) {
      if (!text) return
      const fontSize = Math.min(CW * 0.065, 20)
      ctx.save()
      ctx.globalAlpha    = alpha
      ctx.font           = `italic ${fontSize}px Georgia, serif`
      ctx.fillStyle      = '#2C2820'
      ctx.textAlign      = 'center'
      ctx.textBaseline   = 'middle'
      const lines  = wrapText(text)
      const lineH  = fontSize * 1.7
      const startY = CH / 2 - ((lines.length - 1) * lineH) / 2
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i]
        if (cursor && i === lines.length - 1) {
          const blink = Math.floor(now / 530) % 2 === 0
          line += blink ? '|' : '\u00a0'
        }
        ctx.fillText(line, CW / 2, startY + i * lineH)
      }
      ctx.restore()
    }

    // ── Animation loop ────────────────────────────────────────────

    function frame(now: number) {
      if (!running) return
      if (phaseStart === 0) phaseStart = now
      const elapsed = now - phaseStart

      ctx.clearRect(0, 0, CW, CH)

      if (phase === 'draw') {
        const t = Math.min(elapsed / DRAW_DUR, 1)
        drawFrame(t)
        if (t >= 1) { phase = 'shake'; phaseStart = now }

      } else if (phase === 'shake') {
        const t = elapsed / SHAKE_DUR
        const intensity = 5 * Math.max(0, 1 - t)
        const dx = (Math.random() - 0.5) * intensity
        const dy = (Math.random() - 0.5) * intensity
        ctx.save()
        ctx.translate(dx, dy)
        drawFrame(1)
        ctx.restore()
        if (t >= 1) { buildSplash(); phase = 'burst'; phaseStart = now }

      } else if (phase === 'burst') {
        const t = Math.min(elapsed / BURST_DUR, 1)
        drawSplash(t)
        if (t >= 1) { phase = 'type'; phaseStart = now }

      } else if (phase === 'type') {
        const charsToShow = Math.floor(elapsed / CHAR_MS)
        const visible = sentence.slice(0, charsToShow)
        const done    = charsToShow >= sentence.length
        drawText(visible, 1, !done, now)
        if (done) {
          phase = 'hold'; phaseStart = now
          if (!prefetching) {
            prefetching = true
            fetchSentence().then(s => { nextSentence = s; prefetching = false })
          }
        }

      } else if (phase === 'hold') {
        drawText(sentence, 1, true, now)
        if (elapsed >= HOLD_DUR) { phase = 'fade'; phaseStart = now }

      } else if (phase === 'fade') {
        const t = Math.min(elapsed / FADE_DUR, 1)
        drawText(sentence, 1 - t, false, now)
        if (t >= 1) {
          sentence     = nextSentence || FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
          nextSentence = ''
          cycleIndex   = (cycleIndex + 1) % 3   // advance frame + palette together
          phase        = 'draw'
          phaseStart   = now
        }
      }

      rafId = requestAnimationFrame(frame)
    }

    fetchSentence().then(s => {
      if (!running) return
      sentence = s
      rafId = requestAnimationFrame(frame)
    })

    return () => {
      running = false
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden="true"
    />
  )
}
