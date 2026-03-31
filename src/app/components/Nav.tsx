'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const links = [
  { label: 'Works', href: '#works' },
  { label: 'Paintings', href: '/paintings' },
  { label: 'Writing', href: '#writing' },
]

export default function Nav({ forceDark = false }: { forceDark?: boolean }) {
  const [scrollDark, setScrollDark] = useState(false)

  useEffect(() => {
    if (forceDark) return
    const handleScroll = () => {
      const zone = document.getElementById('transition-zone')
      if (!zone) return
      const rect = zone.getBoundingClientRect()
      // Go dark when the middle of the transition zone crosses the nav
      setScrollDark(rect.top + rect.height / 2 <= 72)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [forceDark])

  const isDark = forceDark || scrollDark

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-700 ${
        isDark
          ? 'bg-[#080C14] border-b border-[#0D1525]'
          : 'bg-[#FAF8F4] border-b border-[#EDE9E4]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={
              isDark
                ? '/Transparent Logo/Logo - White LogoMark.png'
                : '/Transparent Logo/Logo - Black LogoMark.png'
            }
            alt="artbysarps"
            height={40}
            width={150}
            style={{ height: '40px', width: 'auto' }}
            priority
          />
        </Link>
        <div className="flex items-center gap-8">
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`text-xs uppercase tracking-widest transition-colors duration-700 ${
                isDark
                  ? 'text-[#8AAAD8] hover:text-[#C8D8F0]'
                  : 'text-[#8C8278] hover:text-[#2C2820]'
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
