'use client'

import Link from 'next/link'
import { SignInButton, Show } from '@clerk/nextjs'
import { BYPASS_AUTH } from '@/lib/auth-config'
import { ScrambleLink } from '@/components/ui/ScrambleLink'

export function Footer() {
  return (
    <footer className="w-full bg-[#000000] text-white py-[64px] px-[24px] flex flex-col items-center text-center mt-auto select-none">
      {/* 1. White Circle Contact Button with Continuous 360 Spin 24/7 & 20% Hover Dimming (No Zoom) */}
      <Link
        href="/contact"
        className="w-[140px] h-[140px] sm:w-[150px] sm:h-[150px] rounded-full bg-white text-[#000000] flex items-center justify-center font-sans font-bold text-[14px] sm:text-[15px] uppercase mb-[48px] animate-[spin_9.6s_linear_infinite] hover:bg-white/80 transition-colors cursor-pointer no-underline shrink-0"
      >
        <span>CONTACT ME</span>
      </Link>

      {/* 2. Vertical Stack Nav Links: Gap 0px, px-[8px] py-[5px] padding on items, no letter-spacing */}
      <nav className="flex flex-col items-center gap-0 font-sans font-medium text-[14px] sm:text-[15px] uppercase">
        <ScrambleLink
          href="/"
          text="HOME"
          defaultColor="#FFFFFF"
          activeColor="#E74E1B"
          accentColor="#E74E1B"
          className="px-[8px] py-[5px]"
        />
        <ScrambleLink
          href="/how-to-use"
          text="HOW TO USE"
          defaultColor="#FFFFFF"
          activeColor="#E74E1B"
          accentColor="#E74E1B"
          className="px-[8px] py-[5px]"
        />
        <ScrambleLink
          href="/about"
          text="ABOUT ME"
          defaultColor="#FFFFFF"
          activeColor="#E74E1B"
          accentColor="#E74E1B"
          className="px-[8px] py-[5px]"
        />
        <ScrambleLink
          href="/portfolio"
          text="MY PORTFOLIO"
          defaultColor="#FFFFFF"
          activeColor="#E74E1B"
          accentColor="#E74E1B"
          className="px-[8px] py-[5px]"
        />
        <ScrambleLink
          href="/feedback"
          text="FEEDBACK FOR GOODMOTION"
          defaultColor="#FFFFFF"
          activeColor="#E74E1B"
          accentColor="#E74E1B"
          className="px-[8px] py-[5px]"
        />

        {/* Separator Dot: 3px solid white circle with py-[16px] px-[8px] padding */}
        <div className="px-[8px] py-[16px] flex items-center justify-center select-none">
          <span className="w-[3px] h-[3px] rounded-full bg-white block shrink-0" />
        </div>

        {!BYPASS_AUTH ? (
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-white hover:opacity-70 transition-opacity cursor-pointer border-none bg-transparent px-[8px] py-[5px] m-0 font-sans font-medium text-[14px] sm:text-[15px] uppercase mb-[48px]">
                LOGIN / SIGNUP
              </button>
            </SignInButton>
          </Show>
        ) : (
          <SignInButton mode="modal">
            <button className="text-white hover:opacity-70 transition-opacity cursor-pointer border-none bg-transparent px-[8px] py-[5px] m-0 font-sans font-medium text-[14px] sm:text-[15px] uppercase mb-[48px]">
              LOGIN / SIGNUP
            </button>
          </SignInButton>
        )}
      </nav>

      {/* 3. Bottom Legal Copyright & Project Introduction Text */}
      <p className="font-sans font-medium text-[14px] text-white/50 w-full sm:w-[375px] sm:max-w-[375px] leading-[1.5] m-0 p-0 text-center">
        Good Motion is a personal GSAP animation library originally crafted to streamline internal workflows, now made open to the community for building high-performance web experiences.
      </p>
    </footer>
  )
}
