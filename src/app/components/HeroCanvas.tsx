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

    // ── Timings (ms) ─────────────────────────────────────────────
    const DRAW_DUR    = 2200
    const SHAKE_DUR   = 450
    const STROKE_DRAW = 1500  // ms to paint the brush stroke
    const STROKE_HOLD =  500  // ms to hold it fully visible
    const STROKE_FADE =  300  // ms to fade it out before text types in
    const CHAR_MS     = 55
    const HOLD_DUR    = 1600
    const FADE_DUR    = 900

    // ── State ─────────────────────────────────────────────────────
    type Phase = 'draw' | 'shake' | 'burst' | 'type' | 'hold' | 'fade'
    let phase: Phase = 'draw'
    let phaseStart  = 0
    let sentence    = ''
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

    // ── Brush stroke ─────────────────────────────────────────────

    // Three stroke paths as bezier control points [px, py] as fractions of CW / CH.
    // Indexed by cycleIndex % 3, matching the palette order.
    type BezierStroke = {
      p0: [number, number]
      p1: [number, number]
      p2: [number, number]
      p3: [number, number]
      maxR: number   // peak brush radius in px (tip-to-tip width = 2× this)
    }

    const STROKES: BezierStroke[] = [
      // Stroke A — palette 0 (warm earthy): left-centre → right-centre, gentle S-curve upward arc
      { p0: [0.06, 0.56], p1: [0.26, 0.30], p2: [0.70, 0.70], p3: [0.94, 0.44], maxR: 22 },
      // Stroke B — palette 1 (cool moody): diagonal top-left → bottom-right, slight midpoint curve
      { p0: [0.10, 0.18], p1: [0.36, 0.26], p2: [0.60, 0.70], p3: [0.90, 0.82], maxR: 20 },
      // Stroke C — palette 2 (bold contrast): shorter gestural, roughly centred, curves back on itself
      { p0: [0.26, 0.64], p1: [0.58, 0.20], p2: [0.76, 0.60], p3: [0.44, 0.46], maxR: 18 },
    ]

    function drawBrushStroke(drawProgress: number, alpha: number) {
      const ci     = cycleIndex % 3
      const color  = PALETTES[ci][0]   // first colour from each palette
      const stroke = STROKES[ci]

      const POINTS = 200
      const count  = Math.max(1, Math.floor(POINTS * drawProgress))

      // Taper profile: ramp in over first 20%, full for 20–80%, ramp out over last 20%
      function paintTaper(u: number): number {
        if (u < 0.2) return u / 0.2
        if (u > 0.8) return (1 - u) / 0.2
        return 1.0
      }

      // Deterministic per-point hash — consistent across frames for the same stroke
      function strokeHash(n: number): number {
        let h = (ci * 7919 + n * 104729) | 0
        h = ((h ^ (h >>> 16)) * 0x45d9f3b) | 0
        h = ((h ^ (h >>> 16)) * 0x45d9f3b) | 0
        return (h >>> 1) / 0x7fffffff
      }

      // 4 bristle passes: [widthMultiplier, lateralOffsetPx, passOpacity]
      const PASSES: [number, number, number][] = [
        [1.00,  0.0, 0.95],  // main body
        [0.75,  2.5, 0.75],  // right-side bristle
        [0.65, -1.5, 0.70],  // left-side bristle
        [0.70,  4.0, 0.60],  // far right fringe
      ]

      ctx.save()

      for (let p = 0; p < PASSES.length; p++) {
        const [widthMult, lateralOff, passOpacity] = PASSES[p]
        ctx.globalAlpha = alpha * passOpacity
        ctx.fillStyle   = color

        for (let i = 0; i < count; i++) {
          const u  = i / (POINTS - 1)
          const mt = 1 - u

          // Cubic bezier position
          const bx =
            mt*mt*mt * stroke.p0[0] * CW +
            3*mt*mt*u * stroke.p1[0] * CW +
            3*mt*u*u  * stroke.p2[0] * CW +
            u*u*u     * stroke.p3[0] * CW
          const by =
            mt*mt*mt * stroke.p0[1] * CH +
            3*mt*mt*u * stroke.p1[1] * CH +
            3*mt*u*u  * stroke.p2[1] * CH +
            u*u*u     * stroke.p3[1] * CH

          // Bezier tangent (un-normalised derivative ÷ 3)
          const tdx =
            mt*mt * (stroke.p1[0] - stroke.p0[0]) * CW +
            2*mt*u * (stroke.p2[0] - stroke.p1[0]) * CW +
            u*u    * (stroke.p3[0] - stroke.p2[0]) * CW
          const tdy =
            mt*mt * (stroke.p1[1] - stroke.p0[1]) * CH +
            2*mt*u * (stroke.p2[1] - stroke.p1[1]) * CH +
            u*u    * (stroke.p3[1] - stroke.p2[1]) * CH

          // Perpendicular unit vector (rotate tangent 90°)
          const tLen = Math.sqrt(tdx*tdx + tdy*tdy) || 1
          const nx   = -tdy / tLen
          const ny   =  tdx / tLen

          // Edge wobble: ±2.5px perpendicular, deterministic per point & pass
          const wobble = (strokeHash(i * 4 + p) - 0.5) * 5

          const x = bx + nx * (lateralOff + wobble)
          const y = by + ny * (lateralOff + wobble)

          const radius = Math.max(1, paintTaper(u) * widthMult * stroke.maxR)

          ctx.beginPath()
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.restore()
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
        if (t >= 1) { phase = 'burst'; phaseStart = now }

      } else if (phase === 'burst') {
        // Sub-phases: draw stroke → hold → fade out → hand off to 'type'
        const drawProgress = Math.min(elapsed / STROKE_DRAW, 1)
        const fadeElapsed  = Math.max(0, elapsed - STROKE_DRAW - STROKE_HOLD)
        const alpha        = fadeElapsed > 0 ? Math.max(0, 1 - fadeElapsed / STROKE_FADE) : 1
        drawBrushStroke(drawProgress, alpha)
        if (elapsed >= STROKE_DRAW + STROKE_HOLD + STROKE_FADE) { phase = 'type'; phaseStart = now }

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
