'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Works', href: '/works' },
  { label: 'Paintings', href: '/paintings' },
  { label: 'Writing', href: '#writing' },
  { label: 'About', href: '/about' },
]

export default function Nav({ forceDark = false }: { forceDark?: boolean }) {
  const [scrollDark, setScrollDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (forceDark) return
    const handleScroll = () => {
      const zone = document.getElementById('transition-zone')
      if (!zone) return
      const rect = zone.getBoundingClientRect()
      setScrollDark(rect.top + rect.height / 2 <= 72)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [forceDark])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => { setMounted(true) }, [])

  const isDark    = forceDark || scrollDark
  const navIsDark = mounted ? isDark : false

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-700 ${
          navIsDark
            ? 'bg-[#080C14] border-b border-[#0D1525]'
            : 'bg-[#FAF8F4] border-b border-[#EDE9E4]'
        }`}
      >
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src={
                navIsDark
                  ? '/Transparent Logo/Logo - White LogoMark (2).png'
                  : '/Transparent Logo/Logo - Black LogoMark (2).png'
              }
              alt="artbysarps"
              height={48}
              width={180}
              style={{ height: '48px', width: 'auto' }}
              priority
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className={`text-xs uppercase tracking-widest transition-colors duration-700 ${
                  navIsDark
                    ? 'text-[#8AAAD8] hover:text-[#C8D8F0]'
                    : 'text-[#8C8278] hover:text-[#2C2820]'
                }`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] w-6 h-6"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className={`block h-px w-full transition-colors duration-700 ${isDark ? 'bg-[#8AAAD8]' : 'bg-[#8C8278]'}`} />
            <span className={`block h-px w-full transition-colors duration-700 ${isDark ? 'bg-[#8AAAD8]' : 'bg-[#8C8278]'}`} />
            <span className={`block h-px w-full transition-colors duration-700 ${isDark ? 'bg-[#8AAAD8]' : 'bg-[#8C8278]'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-[60] bg-[#080C14] flex flex-col items-center justify-center transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      >
        {/* Close button */}
        <button
          className="absolute top-6 right-8 text-[#384868] hover:text-[#C8D8F0] transition-colors duration-200 text-2xl leading-none"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        <nav className="flex flex-col items-center gap-10" onClick={e => e.stopPropagation()}>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-serif text-4xl text-[#C8D8F0] hover:text-[#8AAAD8] transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}
