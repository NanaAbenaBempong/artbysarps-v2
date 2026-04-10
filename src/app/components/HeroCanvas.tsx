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
    let currentBurstSeed = 0
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

    function createSeededRandom(seed: number): () => number {
      let s = seed
      return function() {
        s = (s * 16807 + 0) % 2147483647
        return (s - 1) / 2147483646
      }
    }

    function drawSplash(
      rctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      palette: string[],
      progress: number,
    ) {
      const eased   = 1 - Math.pow(1 - Math.min(progress * 1.5, 1), 3)
      const fadeOut = progress > 0.7 ? 1 - ((progress - 0.7) / 0.3) : 1

      const rng = createSeededRandom(currentBurstSeed)

      const mainAngle = rng() * Math.PI * 2

      type LineSpec = { angle: number; length: number; width: number; dropR: number }
      const lines: LineSpec[] = []

      // 4 long lines clustered around main angle
      for (let i = 0; i < 4; i++) {
        const angle = mainAngle + (rng() - 0.5) * 0.8
        lines.push({ angle, length: 180 + rng() * 60, width: 1 + rng(), dropR: 6 + rng() * 6 })
      }
      // 4 medium lines loosely around main angle
      for (let i = 0; i < 4; i++) {
        const angle = mainAngle + (rng() - 0.5) * 1.5
        lines.push({ angle, length: 80 + rng() * 50, width: 0.8 + rng() * 0.8, dropR: 3 + rng() * 4 })
      }
      // 3 medium lines opposite direction
      for (let i = 0; i < 3; i++) {
        const angle = mainAngle + Math.PI + (rng() - 0.5) * 1.2
        lines.push({ angle, length: 70 + rng() * 60, width: 0.8 + rng() * 0.6, dropR: 3 + rng() * 3 })
      }
      // 5 random scattered short lines
      for (let i = 0; i < 5; i++) {
        const angle = rng() * Math.PI * 2
        lines.push({ angle, length: 15 + rng() * 45, width: 0.5 + rng() * 0.8, dropR: 1.5 + rng() * 2.5 })
      }

      const color  = palette[Math.floor(rng() * palette.length)]
      const color2 = palette[Math.floor(rng() * palette.length)]

      // ── Main blob ─────────────────────────────────────────────────
      rctx.save()
      rctx.globalAlpha = fadeOut * 0.9
      rctx.fillStyle = color
      rctx.beginPath()
      const blobSize = 55 + rng() * 30
      rctx.moveTo(cx + blobSize * 0.9, cy)
      rctx.bezierCurveTo(
        cx + blobSize,        cy - blobSize * 0.7,
        cx + blobSize * 0.3,  cy - blobSize * 1.1,
        cx - blobSize * 0.2,  cy - blobSize * 0.8,
      )
      rctx.bezierCurveTo(
        cx - blobSize * 0.9, cy - blobSize * 0.5,
        cx - blobSize * 1.0, cy + blobSize * 0.2,
        cx - blobSize * 0.6, cy + blobSize * 0.7,
      )
      rctx.bezierCurveTo(
        cx - blobSize * 0.1, cy + blobSize * 1.1,
        cx + blobSize * 0.6, cy + blobSize * 0.9,
        cx + blobSize * 0.9, cy,
      )
      rctx.fill()

      // ── Secondary blob ────────────────────────────────────────────
      rctx.fillStyle = color2
      rctx.globalAlpha = fadeOut * 0.6
      rctx.beginPath()
      const b2 = blobSize * 0.55
      const box = (rng() - 0.5) * 30
      const boy = (rng() - 0.5) * 30
      rctx.ellipse(cx + box, cy + boy, b2 * 1.2, b2 * 0.8, rng() * Math.PI, 0, Math.PI * 2)
      rctx.fill()
      rctx.restore()

      // ── Spatter lines + endpoint droplets ────────────────────────
      lines.forEach((line, i) => {
        const len = line.length * eased
        const ex  = cx + Math.cos(line.angle) * len
        const ey  = cy + Math.sin(line.angle) * len
        const lineColor = palette[i % palette.length]

        rctx.save()
        rctx.globalAlpha = fadeOut * (0.5 + rng() * 0.5)
        rctx.strokeStyle = lineColor
        rctx.lineWidth   = line.width
        rctx.lineCap     = 'round'
        rctx.beginPath()
        rctx.moveTo(cx, cy)
        rctx.lineTo(ex, ey)
        rctx.stroke()

        rctx.fillStyle  = lineColor
        rctx.globalAlpha = fadeOut * 0.9
        rctx.beginPath()
        rctx.arc(ex, ey, line.dropR * eased, 0, Math.PI * 2)
        rctx.fill()
        rctx.restore()
      })
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
        if (t >= 1) { currentBurstSeed = Math.floor(Math.random() * 999999); phase = 'burst'; phaseStart = now }

      } else if (phase === 'burst') {
        const t = Math.min(elapsed / BURST_DUR, 1)
        drawSplash(ctx, CW / 2, CH / 2, PALETTES[cycleIndex % 3], t)
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
