import Image from 'next/image'
import Link from 'next/link'
import Nav from '../../components/Nav'

export default function BreathingInterfacePage() {
  return (
    <>
      <Nav />

      <main className="bg-[#FAF8F4] min-h-screen pt-32 pb-24">

        {/* ── Back link ───────────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8">
          <Link
            href="/works"
            className="text-xs text-[#8C8278] hover:text-[#2C2820] transition-colors duration-200 uppercase tracking-widest block mb-16"
          >
            ← All works
          </Link>

          {/* ── Label ─────────────────────────────────────────────── */}
          <p className="text-xs uppercase tracking-[0.25em] text-[#8C8278] mb-6">
            Experimental Interface · Design &amp; Technology
          </p>

          {/* ── Title ─────────────────────────────────────────────── */}
          <h1 className="font-serif text-5xl sm:text-6xl text-[#2C2820] mb-6 leading-tight">
            The Breathing Interface
          </h1>

          {/* ── Subtitle ──────────────────────────────────────────── */}
          <p className="text-[#5C4D3C] text-lg leading-relaxed mb-10 max-w-xl">
            A Spatial UX Exploration: Exploring how digital interaction patterns can shape emotional states in physical space.
          </p>

          {/* ── Metadata ──────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-20 border-t border-b border-[#E8E4E0] py-6">
            {[
              { label: 'Type', value: 'Experimental Interface / Spatial UX' },
              { label: 'Role', value: 'Concept, Design, Motion Exploration' },
              { label: 'Timeline', value: 'Nov 2025 – Dec 2025' },
              { label: 'Tools', value: 'Spline AI, Figma' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8C8278] mb-1">{label}</p>
                <p className="text-sm text-[#2C2820]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hero image ────────────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-24">
          <div className="relative w-full overflow-hidden" style={{ borderRadius: '12px', height: '480px' }}>
            <Image
              src="/works/breathing_interface/The Breathing Interface_Hero.png"
              alt="The Breathing Interface hero"
              fill
              style={{ objectFit: 'cover' }}
              sizes="800px"
              priority
            />
          </div>
        </div>

        {/* ── Opening story ─────────────────────────────────────────── */}
        <div className="max-w-[680px] mx-auto px-8 mb-24 text-center">
          <p
            className="font-serif italic text-[#2C2820] leading-[1.85]"
            style={{ fontSize: '1.2rem' }}
          >
            Imagine sitting in a waiting room, moments before seeing your doctor about a life-changing test result. Your thoughts race. Your breathing becomes shallow. You look up and notice a screen on the wall — not displaying information, but a single soft form, slowly expanding and contracting. Its rhythm is steady. Predictable. Calm. Without asking anything of you, the motion invites your attention. This moment is where The Breathing Interface begins.
          </p>
        </div>

        {/* ── Pull quote ────────────────────────────────────────────── */}
        <div className="max-w-[680px] mx-auto px-8 mb-24 text-center">
          <p className="font-serif italic text-[#2C2820] leading-relaxed" style={{ fontSize: '1.5rem' }}>
            &ldquo;What happens when we design spaces that invite people to slow down, rather than ask them to act?&rdquo;
          </p>
        </div>

        {/* ── The Question ──────────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-20">
          <h2 className="font-serif text-2xl text-[#2C2820] mb-5 leading-snug">The Question</h2>
          <p className="text-[#5C4D3C] text-base leading-relaxed">
            Can digital interaction frameworks — such as pacing, rhythm, and minimal feedback — be adapted to spatial design to shape how people feel within a space?
          </p>
        </div>

        {/* ── Full-width image 1 ────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-20">
          <div className="relative w-full overflow-hidden" style={{ borderRadius: '12px', height: '420px' }}>
            <Image
              src="/works/breathing_interface/The Breathing Interface@1-1920x910 (2).png"
              alt="The Breathing Interface exploration"
              fill
              style={{ objectFit: 'cover' }}
              sizes="800px"
            />
          </div>
        </div>

        {/* ── Design Intent ─────────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-20">
          <h2 className="font-serif text-2xl text-[#2C2820] mb-8 leading-snug">Design Intent</h2>
          <div className="flex flex-col gap-5">
            {[
              { label: 'Motion', body: 'Minimal motion communicates without instruction.' },
              { label: 'Rhythm', body: 'Rhythm and repetition guide attention over time.' },
              { label: 'Clarity', body: 'Reducing complexity shifts focus from task completion to presence.' },
            ].map(({ label, body }) => (
              <p key={label} className="text-[#5C4D3C] text-base leading-relaxed">
                <strong className="text-[#2C2820] font-medium">{label}. </strong>
                {body}
              </p>
            ))}
          </div>
        </div>

        {/* ── The Interface ─────────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-20">
          <h2 className="font-serif text-2xl text-[#2C2820] mb-5 leading-snug">The Interface</h2>
          <p className="text-[#5C4D3C] text-base leading-relaxed">
            A single animated form expands and contracts at a steady, predictable pace. There are no prompts, controls, or required actions. Engagement occurs through observation rather than input. The motion is continuous and intentionally non-directional — it can be entered at any moment without a defined start or end.
          </p>
        </div>

        {/* ── Full-width image 2 ────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-10">
          <div className="relative w-full overflow-hidden" style={{ borderRadius: '12px', height: '420px' }}>
            <Image
              src="/works/breathing_interface/The Breathing Interface@1-1920x910 (4).png"
              alt="The Breathing Interface motion study"
              fill
              style={{ objectFit: 'cover' }}
              sizes="800px"
            />
          </div>
        </div>

        {/* ── Video section ─────────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-24">
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', borderRadius: '12px', display: 'block' }}
          >
            <source src="/works/breathing_interface/Breathing.m4v" type="video/mp4" />
          </video>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8C8278] mt-4">
            A looping breathing animation designed to be experienced rather than completed.
          </p>
        </div>

        {/* ── Spatial Context ───────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-20">
          <h2 className="font-serif text-2xl text-[#2C2820] mb-5 leading-snug">Spatial Context</h2>
          <p className="text-[#5C4D3C] text-base leading-relaxed">
            The interface was placed within a small three-dimensional environment resembling a quiet interior room. The room functions as a framing device, positioning the interface as part of a spatial experience rather than a standalone screen.
          </p>
        </div>

        {/* ── Two-column image grid ─────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              '/works/breathing_interface/The Breathing Interface@1-1920x910 (6).png',
              '/works/breathing_interface/The Breathing Interface@1-1920x910.png',
            ].map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{ borderRadius: '12px', height: '280px' }}
              >
                <Image
                  src={src}
                  alt={`The Breathing Interface spatial context ${i + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 640px) 100vw, 400px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Visual System ─────────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-20">
          <h2 className="font-serif text-2xl text-[#2C2820] mb-5 leading-snug">Visual System</h2>
          <p className="text-[#5C4D3C] text-base leading-relaxed">
            A limited, muted color palette. Soft edges and rounded forms. Subtle contrast between foreground and background. These choices support the motion rather than compete with it.
          </p>
        </div>

        {/* ── Reflection ────────────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8 mb-24">
          <h2 className="font-serif text-2xl text-[#2C2820] mb-5 leading-snug">Reflection</h2>
          <p className="text-[#5C4D3C] text-base leading-relaxed">
            The Breathing Interface is an exploratory study rather than a finished product. It was created to investigate how digital UX principles — pacing, restraint, rhythm — can influence emotional experience when applied to physical space.
          </p>
        </div>

        {/* ── Footer nav ────────────────────────────────────────────── */}
        <div className="max-w-[800px] mx-auto px-8">
          <div className="flex items-center justify-between border-t border-[#E8E4E0] pt-10">
            <Link
              href="/works/readnext"
              className="text-xs text-[#8C8278] hover:text-[#2C2820] transition-colors duration-200 uppercase tracking-widest"
            >
              ← ReadNext
            </Link>
            <Link
              href="/works/fittgrad"
              className="text-xs text-[#8C8278] hover:text-[#2C2820] transition-colors duration-200 uppercase tracking-widest"
            >
              FittGrad →
            </Link>
          </div>
        </div>

      </main>
    </>
  )
}
