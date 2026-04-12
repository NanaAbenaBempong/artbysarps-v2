'use client'

import { useEffect, useRef } from 'react'

const FALLBACKS = [
  "I whispered a prayer before getting to work.",
  "She had always believed that God spoke loudest in the quiet.",
  "He smiled at Otto when he was done and soon wished he hadn't.",
]

// Paintings cycled on each loop — preloaded upfront so they're ready by the time
// the reveal phase starts (2.2 s draw phase gives plenty of loading time).
const PAINTING_SRCS = [
  '/paintings/unrestrained/unrestrained-23.png',  // bold colour-block rectangles (Rest)
  '/paintings/unrestrained/unrestrained-11.png',  // Squares — lime green geometric
  '/paintings/unrestrained/unrestrained-12.png',  // Circles — gold on black
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
    const DRAW_DUR          = 2200
    const FRAME_FADE_DUR    =  300  // frame fades out
    const REVEAL_DUR        =  800  // painting wipes in left-to-right
    const PAINTING_HOLD_DUR =  800  // painting holds fully visible
    const PAINTING_FADE_DUR =  400  // painting fades out before text
    const CHAR_MS           =   55
    const HOLD_DUR          = 1600
    const FADE_DUR          =  900

    // ── Preload painting images ───────────────────────────────────
    const paintingImgs: HTMLImageElement[] = PAINTING_SRCS.map(src => {
      const img = new window.Image()
      img.src = src
      return img
    })

    // ── State ─────────────────────────────────────────────────────
    type Phase = 'draw' | 'frame_fade' | 'painting_reveal' | 'painting_hold' | 'painting_fade' | 'type' | 'hold' | 'fade'
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

    // ── Painting reveal ───────────────────────────────────────────

    function drawPainting(img: HTMLImageElement, revealProgress: number, alpha: number) {
      if (!img.complete || !img.naturalWidth) return

      const PAD    = 40
      const FEATHER = 20
      const RADIUS  = 12

      // Fit image within canvas keeping aspect ratio
      const availW = CW - PAD * 2
      const availH = CH - PAD * 2
      const imgRatio    = img.naturalWidth / img.naturalHeight
      const canvasRatio = availW / availH
      let drawW: number, drawH: number
      if (imgRatio > canvasRatio) {
        drawW = availW
        drawH = availW / imgRatio
      } else {
        drawH = availH
        drawW = availH * imgRatio
      }
      const drawX = (CW - drawW) / 2
      const drawY = (CH - drawH) / 2

      ctx.save()
      ctx.globalAlpha = alpha

      // Rounded-rect clip so corners aren't harsh
      ctx.beginPath()
      ctx.roundRect(drawX, drawY, drawW, drawH, RADIUS)
      ctx.clip()

      // Draw the full painting
      ctx.drawImage(img, drawX, drawY, drawW, drawH)

      // Wipe the unrevealed right portion using destination-out (erases drawn pixels)
      if (revealProgress < 1) {
        const edgeX   = drawX + drawW * revealProgress
        const fStartX = Math.max(drawX, edgeX - FEATHER)

        ctx.globalCompositeOperation = 'destination-out'
        ctx.globalAlpha = 1  // full alpha so erase is complete

        // Solid erase: everything right of the reveal edge
        ctx.fillStyle = 'rgba(0,0,0,1)'
        ctx.fillRect(edgeX, drawY, drawX + drawW - edgeX + 1, drawH)

        // Feathered erase: gradient zone just left of the edge
        const grad = ctx.createLinearGradient(fStartX, 0, edgeX, 0)
        grad.addColorStop(0, 'rgba(0,0,0,0)')  // keep pixels
        grad.addColorStop(1, 'rgba(0,0,0,1)')  // erase pixels
        ctx.fillStyle = grad
        ctx.fillRect(fStartX, drawY, edgeX - fStartX, drawH)

        ctx.globalCompositeOperation = 'source-over'
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
        if (t >= 1) { phase = 'frame_fade'; phaseStart = now }

      } else if (phase === 'frame_fade') {
        // Frame fades out — draw it at decreasing opacity
        const t = Math.min(elapsed / FRAME_FADE_DUR, 1)
        ctx.save()
        ctx.globalAlpha = 1 - t
        drawFrame(1)
        ctx.restore()
        if (t >= 1) { phase = 'painting_reveal'; phaseStart = now }

      } else if (phase === 'painting_reveal') {
        // Painting wipes in left-to-right with feathered edge
        const t = Math.min(elapsed / REVEAL_DUR, 1)
        drawPainting(paintingImgs[cycleIndex % 3], t, 1)
        if (t >= 1) { phase = 'painting_hold'; phaseStart = now }

      } else if (phase === 'painting_hold') {
        // Painting holds fully visible
        drawPainting(paintingImgs[cycleIndex % 3], 1, 1)
        if (elapsed >= PAINTING_HOLD_DUR) { phase = 'painting_fade'; phaseStart = now }

      } else if (phase === 'painting_fade') {
        // Painting fades out as text is about to type in
        const t = Math.min(elapsed / PAINTING_FADE_DUR, 1)
        drawPainting(paintingImgs[cycleIndex % 3], 1, 1 - t)
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
