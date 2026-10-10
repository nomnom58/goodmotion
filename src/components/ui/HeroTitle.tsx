'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export function HeroTitle() {
  const black1Ref = useRef<HTMLSpanElement>(null)
  const orange1Ref = useRef<HTMLSpanElement>(null)
  const black2Ref = useRef<HTMLSpanElement>(null)
  const orange2Ref = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      // Line 1 Reveal: Starts instantly at 0s
      tl.to(black1Ref.current, { xPercent: 101, duration: 0.45 }, 0)
        .to(orange1Ref.current, { xPercent: 101, duration: 0.45 }, 0.1)

      // Line 2 Reveal: Starts almost immediately at 0.08s
      tl.to(black2Ref.current, { xPercent: 101, duration: 0.45 }, 0.08)
        .to(orange2Ref.current, { xPercent: 101, duration: 0.45 }, 0.18)

      // Subtitle Fade-In
      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          0.28
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="flex flex-col items-center text-center mt-[48px] mb-[100px] gap-3 w-full sm:w-[400px] mx-auto select-none">
      <h1 className="font-sans font-bold text-[24px] text-[#121212] tracking-[-0.04em] leading-[1.2] flex flex-col items-center">
        {/* Line 1: Best GSAP Library */}
        <span className="relative inline-block overflow-hidden py-[2px] px-[4px]">
          <span className="block">Best GSAP Library</span>
          {/* Orange Curtain (z-10) */}
          <span
            ref={orange1Ref}
            className="absolute inset-0 bg-[#E74E1B] z-10 pointer-events-none"
          />
          {/* Black Curtain (z-20) */}
          <span
            ref={black1Ref}
            className="absolute inset-0 bg-[#000000] z-20 pointer-events-none"
          />
        </span>

        {/* Line 2: Copy. Paste. Done */}
        <span className="relative inline-block overflow-hidden py-[2px] px-[4px]">
          <span className="block">Copy. Paste. Done</span>
          {/* Orange Curtain (z-10) */}
          <span
            ref={orange2Ref}
            className="absolute inset-0 bg-[#E74E1B] z-10 pointer-events-none"
          />
          {/* Black Curtain (z-20) */}
          <span
            ref={black2Ref}
            className="absolute inset-0 bg-[#000000] z-20 pointer-events-none"
          />
        </span>
      </h1>

      <p
        ref={subtitleRef}
        className="font-sans font-normal text-[20px] text-black/75 tracking-[-0.04em] leading-[1.2]"
      >
        Drop into Framer or paste straight into Cursor, Claude, Gemini, or Bolt.
      </p>
    </section>
  )
}
