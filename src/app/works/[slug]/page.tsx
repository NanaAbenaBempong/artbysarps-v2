import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Nav from '../../components/Nav'

/* ── Types ──────────────────────────────────────────────────────── */

type Card = { label: string; title: string; description: string }
type Quote = string
type Takeaway = { number: string; heading: string; body: string }
type SolutionRow = { image: string; imageSide: 'left' | 'right'; label: string; title: string; description: string }
type Section =
  | { kind: 'prose'; heading: string; body: string; image?: string; imageSide?: 'left' | 'right' }
  | { kind: 'cards'; heading: string; cards: Card[]; image?: string; imageSide?: 'left' | 'right' }
  | { kind: 'quotes'; heading: string; quotes: Quote[]; image?: string; imageSide?: 'left' | 'right' }
  | { kind: 'quote'; text: string; attribution: string }
  | { kind: 'takeaways'; heading: string; items: Takeaway[] }
  | { kind: 'prototype'; href: string }
  | { kind: 'solution-rows'; heading: string; rows: SolutionRow[] }

type CaseStudy = {
  slug: string
  title: string
  description: string
  heroImage?: string
  meta: { label: string; value: string }[]
  sections: Section[]
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

/* ── Data ───────────────────────────────────────────────────────── */

const caseStudies: CaseStudy[] = [
  {
    slug: 'readnext',
    title: 'ReadNext',
    heroImage: '/works/readnext/readnext-06.png',
    description:
      'A personalized book discovery experience designed to help readers find their next great read — faster, easier, and with more joy.',
    meta: [
      { label: 'Type', value: 'Class Project' },
      { label: 'Industry', value: 'Reading & Learning Technology' },
      { label: 'Timeline', value: 'Jan 2025 – Apr 2025' },
      { label: 'Role', value: 'UI/UX Designer, Researcher' },
      { label: 'Tools', value: 'Motiff AI, ChatGPT, Julius AI, Dovetail' },
      { label: 'Audience', value: 'Avid Readers (2+ books/month)' },
    ],
    sections: [
      {
        kind: 'prose',
        heading: 'Problem',
        body: 'Readers struggle with decision fatigue and lack of trust when choosing their next book. Existing platforms prioritize commerce and generic bestsellers.',
        image: '/works/readnext/readnext-12.png',
        imageSide: 'right',
      },
      {
        kind: 'cards',
        heading: 'Key Insights',
        cards: [
          {
            label: '01',
            title: 'Discovery is Personal',
            description:
              'Users want context-aware recommendations for their current mood, not just similarity to past reads.',
          },
        ],
      },
      {
        kind: 'quote',
        text: 'The way it flows made me want to scroll.',
        attribution: '— Usability test participant',
      },
      {
        kind: 'cards',
        heading: '',
        cards: [
          {
            label: '02',
            title: 'Lack of Trust',
            description:
              'Participants consistently ignored generic top charts and craved personal curation from friends or themed community lists.',
          },
          {
            label: '03',
            title: 'Choice Overload',
            description:
              'Too much visual clutter caused users to simply stop scrolling, leading to decision paralysis.',
          },
        ],
      },
      {
        kind: 'quote',
        text: 'It was not immediately clear to me that I can select more than one.',
        attribution: '— Usability test participant',
      },
      {
        kind: 'solution-rows',
        heading: 'Design Solution',
        rows: [
          {
            image: '/works/readnext/readnext-08.png',
            imageSide: 'left',
            label: 'Discovery',
            title: 'Personalized Discovery',
            description: 'Personalized and Trending tabs with context tags like "Because you enjoyed…" so every recommendation feels earned.',
          },
          {
            image: '/works/readnext/readnext-14.png',
            imageSide: 'right',
            label: 'Search',
            title: 'Smarter Search',
            description: 'Filter chips and preview-first cards cut visual noise — fewer results, but ones you actually trust.',
          },
          {
            image: '/works/readnext/readnext-13.png',
            imageSide: 'left',
            label: 'Reviews',
            title: 'AI-Powered Reviews',
            description: 'Trending, Expert, and Community lists each labelled by source, so readers always know if a pick is algorithmic or human.',
          },
          {
            image: '/works/readnext/readnext-10.png',
            imageSide: 'right',
            label: 'Tracking',
            title: 'Save & Track',
            description: 'Progress bars, page counts, and last-read timestamps — your reading life stays organised without any manual effort.',
          },
        ],
      },
      {
        kind: 'quote',
        text: 'I just really like how clean the interface is. Not cluttered, it\u2019s easy to use.',
        attribution: '— Usability test participant',
      },
      {
        kind: 'prose',
        heading: 'Usability Testing',
        body: 'Moderated tests with 5 avid readers across 6 core tasks. Key findings: scannability improvements for Discover and Explore tasks; filter redesign after errors in Search & Filter task; refinements to Reviews and Explore flows.',
        image: '/works/readnext/readnext-19.png',
        imageSide: 'left',
      },
      {
        kind: 'quote',
        text: 'Give me more than 280 characters. I\u2019m not writing a tweet.',
        attribution: '— Usability test participant',
      },
      {
        kind: 'cards',
        heading: 'AI Tools Used',
        cards: [
          {
            label: 'Wireframing',
            title: 'Motiff AI',
            description: 'Generated initial UI structures, accelerated wireframing.',
          },
          {
            label: 'Research',
            title: 'Dovetail',
            description: 'Organized user interviews, enabled rapid pattern identification.',
          },
          {
            label: 'Analysis',
            title: 'Julius AI',
            description: 'Analyzed usability data, visualized insights.',
          },
          {
            label: 'Copy',
            title: 'ChatGPT',
            description: 'Drafted interview protocols and UI microcopy.',
          },
        ],
      },
      {
        kind: 'takeaways',
        heading: 'Key Takeaways',
        items: [
          {
            number: '01',
            heading: 'Transparency Builds Trust',
            body: 'Clear explanations for why a book was recommended were crucial.',
          },
          {
            number: '02',
            heading: 'Community over Algorithm',
            body: 'Readers trusted community lists more than AI suggestions.',
          },
          {
            number: '03',
            heading: 'Focus on Gist',
            body: 'Summarized insights and scannable layouts improved engagement.',
          },
          {
            number: '04',
            heading: 'AI as Accelerator',
            body: 'Tools sped up wireframing and data analysis.',
          },
        ],
      },
    ],
    prev: null,
    next: { slug: 'breathing-interface', title: 'The Breathing Interface' },
  },
  {
    slug: 'fittgrad',
    title: 'FittGrad',
    description:
      'A fitness app designed to help graduate students stay active despite their demanding schedules.',
    meta: [
      { label: 'Type', value: 'Personal Project' },
      { label: 'Industry', value: 'Fitness & Wellness' },
      { label: 'Timeline', value: 'Oct 2024 – Dec 2024' },
      { label: 'Role', value: 'UI/UX Designer, Researcher' },
      { label: 'Tools', value: 'Figma' },
      { label: 'Audience', value: 'Graduate Students' },
    ],
    sections: [
      {
        kind: 'prototype',
        href: 'https://www.figma.com/proto/27TfwLPOVpQpAgBjsmP87Q/Fitness-App?page-id=1%3A7&node-id=203-2&viewport=186%2C999%2C0.18&t=cCWbURAM2rXk7zbs-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=203%3A2',
      },
      {
        kind: 'prose',
        heading: 'Problem',
        body: 'Graduate students face significant difficulty maintaining a consistent workout routine due to time scarcity and heavy academic demands.',
      },
      {
        kind: 'cards',
        heading: 'Key Insights',
        cards: [
          {
            label: '01',
            title: 'Time & Scheduling',
            description:
              'Biggest barrier is finding time; users prefer 10–30 min flexible workouts.',
          },
          {
            label: '02',
            title: 'Motivation & Social',
            description:
              'Users want social features like sharing achievements and joining challenges.',
          },
          {
            label: '03',
            title: 'Tracking',
            description:
              'Personalized progress tracking and visual dashboards are highly valued.',
          },
          {
            label: '04',
            title: 'Personalization',
            description:
              'Generic plans lead to abandonment; users want plans tailored to energy and mood.',
          },
        ],
      },
      {
        kind: 'cards',
        heading: 'Design Solution',
        cards: [
          {
            label: 'Workouts',
            title: 'Flexible Workouts',
            description:
              'Streamlined home screen with time-based 10–30 min suggestions.',
          },
          {
            label: 'Routine',
            title: 'Routine Commitment',
            description:
              'Integrated schedule flow with reminders and workout planning.',
          },
          {
            label: 'Community',
            title: 'Community',
            description:
              'Challenges and Find Workout Partners screens for social accountability.',
          },
          {
            label: 'Progress',
            title: 'Progress Tracking',
            description:
              'Clear dashboards for streaks, achievements, and goal progress.',
          },
        ],
      },
      {
        kind: 'prose',
        heading: 'Usability Testing',
        body: 'Moderated tests with 10 graduate students across Onboarding, Scheduling, Progress Tracking, and Community Challenge tasks. Refinements to calendar sync and dashboard clarity after testing.',
      },
      {
        kind: 'takeaways',
        heading: 'Key Takeaways',
        items: [
          {
            number: '01',
            heading: 'Design for Micro-Moments',
            body: 'Fitness must be designed in short, flexible, integrated bursts.',
          },
          {
            number: '02',
            heading: 'Motivation is Social & Visual',
            body: 'Progress tracking and community features drive consistency.',
          },
          {
            number: '03',
            heading: 'Seamless Integration',
            body: 'Making workouts one-click schedulable removed the biggest friction point.',
          },
          {
            number: '04',
            heading: 'AI as Accelerator',
            body: 'Sped up wireframing and research analysis phases.',
          },
        ],
      },
    ],
    prev: { slug: 'breathing-interface', title: 'The Breathing Interface' },
    next: null,
  },
]

/* ── generateStaticParams ───────────────────────────────────────── */

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

/* ── Section renderers ──────────────────────────────────────────── */

function SectionImage({ src, side }: { src: string; side: 'left' | 'right' }) {
  return (
    <div className={`relative min-h-[320px] rounded-2xl shadow-sm overflow-hidden${side === 'left' ? ' md:order-first' : ''}`}>
      <Image
        src={src}
        alt=""
        fill
        style={{ objectFit: 'contain', objectPosition: 'top center' }}
        sizes="(max-width: 768px) 100vw, 400px"
      />
    </div>
  )
}

function ProseSection({ heading, body, image, imageSide }: { heading: string; body: string; image?: string; imageSide?: 'left' | 'right' }) {
  if (image) {
    return (
      <div className="mb-16">
        <h2 className="font-serif text-2xl text-[#2C2820] mb-8 leading-snug">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <p className={`text-[#5C4D3C] text-base leading-relaxed${imageSide === 'left' ? ' md:order-last' : ''}`}>{body}</p>
          <SectionImage src={image} side={imageSide!} />
        </div>
      </div>
    )
  }
  return (
    <div className="mb-16">
      <h2 className="font-serif text-2xl text-[#2C2820] mb-5 leading-snug">{heading}</h2>
      <p className="text-[#5C4D3C] text-base leading-relaxed">{body}</p>
    </div>
  )
}

function QuoteBlock({ text, attribution }: { text: string; attribution: string }) {
  return (
    <div className="mb-16">
      <blockquote className="border-l-2 border-[#2C2820] pl-6">
        <p className="font-serif italic text-xl text-[#2C2820] leading-relaxed">
          &ldquo;{text}&rdquo;
        </p>
        <p className="text-sm text-[#8C8278] mt-3">{attribution}</p>
      </blockquote>
    </div>
  )
}

function CardsSection({ heading, cards, image, imageSide }: { heading: string; cards: Card[]; image?: string; imageSide?: 'left' | 'right' }) {
  const isThree = cards.length === 3
  const cardGrid = (
    <div className={`grid gap-4 grid-cols-1 ${isThree ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}${image && imageSide === 'left' ? ' md:order-last' : ''}`}>
      {cards.map((card) => (
        <div key={card.title} className="bg-[#F0EDE8] rounded-lg p-6 flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8C8278]">{card.label}</span>
          <h3 className="font-serif text-lg text-[#2C2820] leading-snug">{card.title}</h3>
          <p className="text-sm text-[#5C4D3C] leading-relaxed">{card.description}</p>
        </div>
      ))}
    </div>
  )
  if (image) {
    return (
      <div className="mb-16">
        {heading && <h2 className="font-serif text-2xl text-[#2C2820] mb-8 leading-snug">{heading}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {cardGrid}
          <SectionImage src={image} side={imageSide!} />
        </div>
      </div>
    )
  }
  return (
    <div className="mb-16">
      {heading && <h2 className="font-serif text-2xl text-[#2C2820] mb-8 leading-snug">{heading}</h2>}
      {cardGrid}
    </div>
  )
}

function QuotesSection({ heading, quotes, image, imageSide }: { heading: string; quotes: Quote[]; image?: string; imageSide?: 'left' | 'right' }) {
  const quoteList = (
    <div className={`flex flex-col gap-6${image && imageSide === 'left' ? ' md:order-last' : ''}`}>
      {quotes.map((q, i) => (
        <blockquote key={i} className="border-l-2 border-[#2C2820] pl-6">
          <p className="font-serif italic text-xl text-[#2C2820] leading-relaxed">
            &ldquo;{q}&rdquo;
          </p>
        </blockquote>
      ))}
    </div>
  )
  if (image) {
    return (
      <div className="mb-16">
        <h2 className="font-serif text-2xl text-[#2C2820] mb-8 leading-snug">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {quoteList}
          <SectionImage src={image} side={imageSide!} />
        </div>
      </div>
    )
  }
  return (
    <div className="mb-16">
      <h2 className="font-serif text-2xl text-[#2C2820] mb-8 leading-snug">{heading}</h2>
      {quoteList}
    </div>
  )
}

function SolutionRowsSection({ heading, rows }: { heading: string; rows: SolutionRow[] }) {
  return (
    <div className="mb-16">
      <h2 className="font-serif text-2xl text-[#2C2820] mb-10 leading-snug">{heading}</h2>
      <div className="flex flex-col gap-16">
        {rows.map((row) => (
          <div key={row.title} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Image — always first on mobile (order-1), reordered on desktop */}
            <div className={`relative min-h-[360px] rounded-2xl shadow-sm overflow-hidden order-1${row.imageSide === 'left' ? ' md:order-first' : ' md:order-last'}`}>
              <Image
                src={row.image}
                alt={row.title}
                fill
                style={{ objectFit: 'contain', objectPosition: 'top center' }}
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            {/* Text — always second on mobile, reordered on desktop */}
            <div className={`order-2${row.imageSide === 'left' ? ' md:order-last' : ' md:order-first'}`}>
              <p className="text-xs uppercase tracking-widest text-[#8C8278] mb-3">{row.label}</p>
              <h3 className="font-serif text-2xl text-[#2C2820] mb-4 leading-snug">{row.title}</h3>
              <p className="text-[#5C4D3C] text-base leading-relaxed">{row.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TakeawaysSection({ heading, items }: { heading: string; items: Takeaway[] }) {
  return (
    <div className="mb-16">
      <h2 className="font-serif text-2xl text-[#2C2820] mb-8 leading-snug">{heading}</h2>
      <div className="flex flex-col gap-8">
        {items.map((item) => (
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
  )
}

function PrototypeButton({ href }: { href: string }) {
  return (
    <div className="mb-16">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#2C2820] text-[#FAF8F4] text-xs uppercase tracking-widest px-6 py-3 hover:bg-[#5C4D3C] transition-colors duration-200"
      >
        View Interactive Prototype →
      </a>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────── */

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cs = caseStudies.find((c) => c.slug === slug)
  if (!cs) notFound()

  return (
    <>
      <Nav />

      <main className="bg-[#FAF8F4] min-h-screen pt-32 pb-24">
        <div className="max-w-[800px] mx-auto px-8">

          {/* Back link */}
          <Link
            href="/works"
            className="text-xs text-[#8C8278] hover:text-[#2C2820] transition-colors duration-200 uppercase tracking-widest block mb-16"
          >
            ← All works
          </Link>

          {/* Hero */}
          <h1 className="font-serif text-5xl sm:text-6xl text-[#2C2820] mb-6 leading-tight">
            {cs.title}
          </h1>
          <p className="text-[#5C4D3C] text-lg leading-relaxed mb-10 max-w-xl">
            {cs.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-14 border-t border-b border-[#E8E4E0] py-6">
            {cs.meta.map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8C8278] mb-1">{label}</p>
                <p className="text-sm text-[#2C2820]">{value}</p>
              </div>
            ))}
          </div>

          {/* Hero image */}
          {cs.heroImage ? (
            <div className="relative w-full rounded-2xl overflow-hidden mb-20" style={{ height: '500px' }}>
              <Image
                src={cs.heroImage}
                alt={cs.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="800px"
                priority
              />
            </div>
          ) : (
            <div
              className="w-full rounded-2xl mb-20 flex items-center justify-center"
              style={{ height: '500px', backgroundColor: '#E8E2D9' }}
            >
              <span className="font-serif text-2xl text-[#8C8278]">{cs.title}</span>
            </div>
          )}

          {/* Sections */}
          {cs.sections.map((section, i) => {
            if (section.kind === 'prose')
              return <ProseSection key={i} {...section} />
            if (section.kind === 'cards')
              return <CardsSection key={i} {...section} />
            if (section.kind === 'quotes')
              return <QuotesSection key={i} {...section} />
            if (section.kind === 'takeaways')
              return <TakeawaysSection key={i} {...section} />
            if (section.kind === 'prototype')
              return <PrototypeButton key={i} href={section.href} />
            if (section.kind === 'solution-rows')
              return <SolutionRowsSection key={i} {...section} />
            return null
          })}

          {/* Footer nav */}
          <div className="flex items-center justify-between border-t border-[#E8E4E0] pt-10 mt-8">
            {cs.prev ? (
              <Link
                href={`/works/${cs.prev.slug}`}
                className="text-xs text-[#8C8278] hover:text-[#2C2820] transition-colors duration-200 uppercase tracking-widest"
              >
                ← {cs.prev.title}
              </Link>
            ) : (
              <span />
            )}
            {cs.next ? (
              <Link
                href={`/works/${cs.next.slug}`}
                className="text-xs text-[#8C8278] hover:text-[#2C2820] transition-colors duration-200 uppercase tracking-widest"
              >
                {cs.next.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>

        </div>
      </main>
    </>
  )
}
