'use client'

import { useEffect, useRef } from 'react'

const FALLBACKS = [
  "I whispered a prayer before getting to work.",
  "She had always believed that God spoke loudest in the quiet.",
  "He smiled at Otto when he was done and soon wished he hadn't.",
]

const SPLASH_COLORS = ['#c17a3a', '#4a7a6a', '#8a4a6a', '#6a4a8a']

// Wireframe rects as [x, y, w, h] fractions of canvas CSS size
const RECTS: [number, number, number, number][] = [
  [0.08, 0.04, 0.84, 0.92],   // outer frame
  [0.08, 0.04, 0.84, 0.065],  // status bar
  [0.10, 0.115, 0.80, 0.12],  // header
  [0.12, 0.265, 0.76, 0.13],  // card 1
  [0.12, 0.42,  0.76, 0.13],  // card 2
  [0.12, 0.575, 0.76, 0.13],  // card 3
  [0.25, 0.80,  0.50, 0.08],  // button
]

interface Particle {
  x: number; y: number
  vx: number; vy: number
  r: number; color: string
}

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

    // ── Setup ────────────────────────────────────────────────────
    function setup() {
      const rect = canvas!.getBoundingClientRect()
      CW = rect.width
      CH = rect.height
      canvas!.width = Math.round(CW * dpr)
      canvas!.height = Math.round(CH * dpr)
      // canvas.width assignment resets the transform; re-apply DPR scale
      canvas!.getContext('2d')!.scale(dpr, dpr)
    }
    setup()

    const ctx = canvas.getContext('2d')!

    // ── Timings (ms) ─────────────────────────────────────────────
    const DRAW_DUR  = 2200
    const SHAKE_DUR = 450
    const BURST_DUR = 750
    const CHAR_MS   = 55
    const HOLD_DUR  = 1600
    const FADE_DUR  = 900

    // ── State ────────────────────────────────────────────────────
    type Phase = 'draw' | 'shake' | 'burst' | 'type' | 'hold' | 'fade'
    let phase: Phase = 'draw'
    let phaseStart = 0
    let sentence = ''
    let particles: Particle[] = []
    let nextSentence = ''   // pre-fetched for next cycle
    let prefetching = false

    // ── Draw helpers ─────────────────────────────────────────────

    function drawAnimatedRect(
      x: number, y: number, w: number, h: number, progress: number
    ) {
      const perim = 2 * (w + h)
      ctx.save()
      ctx.setLineDash([perim, perim])
      ctx.lineDashOffset = perim * (1 - progress)
      ctx.beginPath()
      ctx.rect(x, y, w, h)
      ctx.stroke()
      ctx.restore()
    }

    function drawWireframe(totalProgress: number) {
      ctx.strokeStyle = '#8C8278'
      ctx.lineWidth = 1
      const N = RECTS.length
      for (let i = 0; i < N; i++) {
        const [rx, ry, rw, rh] = RECTS[i]
        const start = i / N
        const end   = (i + 1) / N
        const p = Math.max(0, Math.min(1, (totalProgress - start) / (end - start)))
        if (p > 0) drawAnimatedRect(rx * CW, ry * CH, rw * CW, rh * CH, p)
      }
    }

    function spawnParticles() {
      particles = []
      for (const [rx, ry, rw, rh] of RECTS) {
        const cx = (rx + rw / 2) * CW
        const cy = (ry + rh / 2) * CH
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4
          const speed = 1.5 + Math.random() * 4
          particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: 2 + Math.random() * 6,
            color: SPLASH_COLORS[Math.floor(Math.random() * SPLASH_COLORS.length)],
          })
        }
      }
    }

    function wrapText(text: string): string[] {
      const fontSize = Math.min(CW * 0.065, 20)
      ctx.font = `italic ${fontSize}px Georgia, serif`
      const maxW = CW * 0.85
      const words = text.split(' ')
      const lines: string[] = []
      let cur = ''
      for (const word of words) {
        const test = cur ? `${cur} ${word}` : word
        if (ctx.measureText(test).width > maxW && cur) {
          lines.push(cur)
          cur = word
        } else {
          cur = test
        }
      }
      if (cur) lines.push(cur)
      return lines
    }

    function drawText(text: string, alpha: number, cursor: boolean, now: number) {
      if (!text) return
      const fontSize = Math.min(CW * 0.065, 20)
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.font = `italic ${fontSize}px Georgia, serif`
      ctx.fillStyle = '#2C2820'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const lines = wrapText(text)
      const lineH = fontSize * 1.7
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

    // ── Animation loop ───────────────────────────────────────────

    function frame(now: number) {
      if (!running) return
      if (phaseStart === 0) phaseStart = now
      const elapsed = now - phaseStart

      ctx.clearRect(0, 0, CW, CH)

      if (phase === 'draw') {
        const t = Math.min(elapsed / DRAW_DUR, 1)
        drawWireframe(t)
        if (t >= 1) { phase = 'shake'; phaseStart = now }

      } else if (phase === 'shake') {
        const t = elapsed / SHAKE_DUR
        const intensity = 5 * Math.max(0, 1 - t)
        const dx = (Math.random() - 0.5) * intensity
        const dy = (Math.random() - 0.5) * intensity
        ctx.save()
        ctx.translate(dx, dy)
        drawWireframe(1)
        ctx.restore()
        if (t >= 1) {
          spawnParticles()
          phase = 'burst'
          phaseStart = now
        }

      } else if (phase === 'burst') {
        const t = Math.min(elapsed / BURST_DUR, 1)
        for (const p of particles) {
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.96
          p.vy *= 0.96
          ctx.globalAlpha = 1 - t
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        if (t >= 1) { phase = 'type'; phaseStart = now }

      } else if (phase === 'type') {
        const charsToShow = Math.floor(elapsed / CHAR_MS)
        const visible = sentence.slice(0, charsToShow)
        const done = charsToShow >= sentence.length
        drawText(visible, 1, !done, now)
        if (done) {
          phase = 'hold'
          phaseStart = now
          // pre-fetch the next sentence while user reads
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
          sentence = nextSentence || FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)]
          nextSentence = ''
          phase = 'draw'
          phaseStart = now
        }
      }

      rafId = requestAnimationFrame(frame)
    }

    // Fetch first sentence then start the loop
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
