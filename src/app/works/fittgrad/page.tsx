import Image from 'next/image'
import Link from 'next/link'
import Nav from '../../components/Nav'
import { getAdjacentWorks } from '../../../lib/works'

export default function FittGradPage() {
  const { prev, next } = getAdjacentWorks('fittgrad')
  return (
    <>
      <Nav />

      <main className="bg-[#FAF8F4] min-h-screen pt-32 pb-24">
        <div className="max-w-[800px] mx-auto px-8">

          {/* ── Back link ─────────────────────────────────────────── */}
          <Link
            href="/works"
            className="text-xs text-[#8C8278] hover:text-[#2C2820] transition-colors duration-200 uppercase tracking-widest block mb-16"
          >
            ← All works
          </Link>

          {/* ── Title ─────────────────────────────────────────────── */}
          <h1 className="font-serif text-5xl sm:text-6xl text-[#2C2820] mb-6 leading-tight">
            FittGrad
          </h1>

          {/* ── Subtitle ──────────────────────────────────────────── */}
          <p className="text-[#5C4D3C] text-lg leading-relaxed mb-10 max-w-xl">
            A fitness app designed around the unpredictable schedules of graduate students — adaptive, low-friction, and built for real academic life.
          </p>

          {/* ── Metadata ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-14 border-t border-b border-[#E8E4E0] py-6">
            {[
              { label: 'Type',     value: 'Class Project' },
              { label: 'Timeline', value: 'Jan 2025 – Apr 2025' },
              { label: 'Role',     value: 'UI/UX Designer, Researcher' },
              { label: 'Tools',    value: 'Figma, Julius AI' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8C8278] mb-1">{label}</p>
                <p className="text-sm text-[#2C2820]">{value}</p>
              </div>
            ))}
          </div>

          {/* ── Hero image ────────────────────────────────────────── */}
          <div className="relative w-full rounded-2xl overflow-hidden mb-20" style={{ height: '500px' }}>
            <Image
              src="/works/fittgrad/fittgrad-hero.png"
              alt="FittGrad hero"
              fill
              style={{ objectFit: 'contain' }}
              sizes="800px"
              priority
            />
          </div>

          {/* ── Problem ───────────────────────────────────────────── */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl text-[#2C2820] mb-5 leading-snug">Problem</h2>
            <p className="text-[#5C4D3C] text-base leading-relaxed">
              Graduate students want to stay consistent with fitness, but existing apps assume fixed routines and free time. For grad students juggling classes, research, and unpredictable schedules, most fitness apps feel built for someone else.
            </p>
          </div>

          {/* ── Key Insights ──────────────────────────────────────── */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl text-[#2C2820] mb-8 leading-snug">Key Insights</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              {[
                {
                  label: '01',
                  title: 'Schedule is the #1 Barrier',
                  description: 'Every participant cited timing and schedule conflicts as the primary obstacle to consistent exercise.',
                },
                {
                  label: '02',
                  title: 'Cardio & Strength Dominate',
                  description: '7 of 9 participants preferred cardio; strength training was a close second. Workouts need to reflect these preferences.',
                },
                {
                  label: '03',
                  title: '88.9% Want Adaptive Workouts',
                  description: 'Nearly all participants wanted the app to suggest workouts based on available time and energy levels.',
                },
              ].map((card) => (
                <div key={card.title} className="bg-[#F0EDE8] rounded-lg p-6 flex flex-col gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#8C8278]">{card.label}</span>
                  <h3 className="font-serif text-lg text-[#2C2820] leading-snug">{card.title}</h3>
                  <p className="text-sm text-[#5C4D3C] leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Design Solution ───────────────────────────────────── */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl text-[#2C2820] mb-10 leading-snug">Design Solution</h2>
            <div className="flex flex-col gap-16">

              {/* Row 1 — image left, text right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative min-h-[360px] rounded-2xl shadow-sm overflow-hidden order-1 md:order-first">
                  <Image
                    src="/works/fittgrad/fittgrad-schedule.png"
                    alt="Adaptive Scheduling"
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'top center' }}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="order-2 md:order-last">
                  <p className="text-xs uppercase tracking-widest text-[#8C8278] mb-3">SCHEDULING</p>
                  <h3 className="font-serif text-2xl text-[#2C2820] mb-4 leading-snug">Adaptive Scheduling</h3>
                  <p className="text-[#5C4D3C] text-base leading-relaxed">
                    A weekly calendar that slots workouts around classes and deadlines — no manual planning needed.
                  </p>
                </div>
              </div>

              {/* Row 2 — text left, image right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative min-h-[360px] rounded-2xl shadow-sm overflow-hidden order-1 md:order-last">
                  <Image
                    src="/works/fittgrad/fittgrad-workout.png"
                    alt="Workout Discovery"
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'top center' }}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="order-2 md:order-first">
                  <p className="text-xs uppercase tracking-widest text-[#8C8278] mb-3">DISCOVERY</p>
                  <h3 className="font-serif text-2xl text-[#2C2820] mb-4 leading-snug">Workout Discovery</h3>
                  <p className="text-[#5C4D3C] text-base leading-relaxed">
                    Rated exercises with video previews — browse by type, duration, or intensity to find what fits your available time.
                  </p>
                </div>
              </div>

              {/* Row 3 — image left, text right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative min-h-[360px] rounded-2xl shadow-sm overflow-hidden order-1 md:order-first">
                  <Image
                    src="/works/fittgrad/fittgrad-active.png"
                    alt="In-Workout Experience"
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'top center' }}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="order-2 md:order-last">
                  <p className="text-xs uppercase tracking-widest text-[#8C8278] mb-3">ACTIVE WORKOUT</p>
                  <h3 className="font-serif text-2xl text-[#2C2820] mb-4 leading-snug">In-Workout Experience</h3>
                  <p className="text-[#5C4D3C] text-base leading-relaxed">
                    Video-guided exercises with play/pause and a clear end-workout action — minimal friction when you're mid-rep.
                  </p>
                </div>
              </div>

              {/* Row 4 — text left, image right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative min-h-[360px] rounded-2xl shadow-sm overflow-hidden order-1 md:order-last">
                  <Image
                    src="/works/fittgrad/fittgrad-history.png"
                    alt="Progress Tracking"
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'top center' }}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="order-2 md:order-first">
                  <p className="text-xs uppercase tracking-widest text-[#8C8278] mb-3">TRACKING</p>
                  <h3 className="font-serif text-2xl text-[#2C2820] mb-4 leading-snug">Progress Tracking</h3>
                  <p className="text-[#5C4D3C] text-base leading-relaxed">
                    A workout history log with dates, duration, and intensity — so consistency becomes visible over time.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ── Key Takeaways ─────────────────────────────────────── */}
          <div className="mb-16">
            <h2 className="font-serif text-2xl text-[#2C2820] mb-8 leading-snug">Key Takeaways</h2>
            <div className="flex flex-col gap-8">
              {[
                {
                  number: '01',
                  heading: 'Flexibility over Structure',
                  body: "Grad students don\u2019t need more discipline tools \u2014 they need apps that bend around their lives.",
                },
                {
                  number: '02',
                  heading: 'Research Shapes Design',
                  body: "Every feature maps directly to a survey finding \u2014 nothing was assumed.",
                },
                {
                  number: '03',
                  heading: 'Low Friction Wins',
                  body: "The fewer decisions a tired grad student has to make, the more likely they are to actually work out.",
                },
              ].map((item) => (
                <div key={item.number} className="flex gap-6">
                  <span
                    className="font-serif text-4xl leading-none shrink-0 select-none"
                    style={{ color: '#E8E2D9' }}
                  >
                    {item.number}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-serif text-lg text-[#2C2820] mb-1 leading-snug">
                      {item.heading}
                    </h3>
                    <p className="text-sm text-[#5C4D3C] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer nav ────────────────────────────────────────── */}
          <div className="flex items-center justify-between border-t border-[#E8E4E0] pt-10 mt-8">
            <Link
              href={`/works/${prev.slug}`}
              className="text-xs text-[#8C8278] hover:text-[#2C2820] transition-colors duration-200 uppercase tracking-widest"
            >
              ← {prev.title}
            </Link>
            <Link
              href={`/works/${next.slug}`}
              className="text-xs text-[#8C8278] hover:text-[#2C2820] transition-colors duration-200 uppercase tracking-widest"
            >
              {next.title} →
            </Link>
          </div>

        </div>
      </main>
    </>
  )
}
