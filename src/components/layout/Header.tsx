'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { InteractiveLogo } from '@/components/ui/InteractiveLogo'
import { ScrambleLink } from '@/components/ui/ScrambleLink'
import { BYPASS_AUTH } from '@/lib/auth-config'
import { Menu, X } from 'lucide-react'

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
)

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Active Tab Logic: HOME remains active for / and any detail pages (not /how-to-use and not /about)
  const isHowToUseActive = pathname === '/how-to-use'
  const isAboutActive = pathname === '/about'
  const isHomeActive = !isHowToUseActive && !isAboutActive

  return (
    <header className="w-full bg-white sticky top-0 md:relative md:top-auto z-50">
      <div className="w-full px-4 pt-3 pb-3 relative z-50 bg-white">
        {/* ================= DESKTOP & TABLET HEADER ================= */}
        <div className="hidden md:flex flex-col w-full">
          {/* Row 1: Interactive Logo full width */}
          <Link href="/" className="w-full block">
            <InteractiveLogo text="GOODMOTION" />
          </Link>

          {/* Row 2: Navigation Menu Bar below Logo */}
          <div className="flex items-center justify-between w-full py-4 text-[14px]">
            {/* Left side links */}
            <nav className="flex items-center gap-0 font-sans font-medium text-[14px] uppercase">
              <ScrambleLink href="/" text="HOME" isActive={isHomeActive} className="px-[8px] py-[5px]" />
              <ScrambleLink href="/how-to-use" text="HOW TO USE" isActive={isHowToUseActive} className="px-[8px] py-[5px]" />
              <ScrambleLink href="/about" text="ABOUT ME" isActive={isAboutActive} className="px-[8px] py-[5px]" />
            </nav>

            {/* Right side auth & github */}
            <div className="flex items-center gap-0 font-sans font-medium text-[14px] text-[#121212] uppercase">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-[8px] py-[5px] text-[#121212] hover:text-[#E74E1B] transition-colors"
              >
                <GithubIcon size={16} />
                <span>0</span>
              </a>

              {!BYPASS_AUTH ? (
                <>
                  <Show when="signed-out">
                    <div className="flex items-center gap-1 px-[8px] py-[5px] font-sans font-medium text-[14px] text-[#121212] uppercase">
                      <SignInButton mode="modal">
                        <span className="cursor-pointer">
                          <ScrambleLink href="#" text="LOGIN" className="px-[4px] py-[2px]" />
                        </span>
                      </SignInButton>
                      <span className="opacity-40">/</span>
                      <SignUpButton mode="modal">
                        <span className="cursor-pointer">
                          <ScrambleLink href="#" text="SIGNUP" className="px-[4px] py-[2px]" />
                        </span>
                      </SignUpButton>
                    </div>
                  </Show>

                  <Show when="signed-in">
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonAvatarBox: 'w-7 h-7',
                        },
                      }}
                    />
                  </Show>
                </>
              ) : (
                <SignInButton mode="modal">
                  <span className="cursor-pointer">
                    <ScrambleLink href="#" text="LOGIN / SIGNUP" className="px-[8px] py-[5px]" />
                  </span>
                </SignInButton>
              )}
            </div>
          </div>
        </div>

        {/* ================= MOBILE HEADER ================= */}
        <div className="flex md:hidden items-start justify-between bg-white">
          {/* Static Mobile Logo Text */}
          <Link href="/" className="no-underline">
            <span
              className="text-[36px] leading-[36px] font-black uppercase text-primary-text tracking-tighter"
              style={{ fontFamily: 'Impact, sans-serif' }}
            >
              GOOD MOTION
            </span>
          </Link>

          {/* Morphing Hamburger -> X Icon Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-[5px] p-2 text-primary-text hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none mt-[-4px]"
            aria-label="Toggle Menu"
          >
            <span
              className={`w-6 h-[2px] bg-primary-text rounded-full transform transition-all duration-300 ease-in-out ${
                mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : 'rotate-0 translate-y-0'
              }`}
            />
            <span
              className={`w-6 h-[2px] bg-primary-text rounded-full transition-all duration-200 ease-in-out ${
                mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`}
            />
            <span
              className={`w-6 h-[2px] bg-primary-text rounded-full transform transition-all duration-300 ease-in-out ${
                mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : 'rotate-0 translate-y-0'
              }`}
            />
          </button>
        </div>

        {/* ================= MOBILE SLIDE-DOWN DROPDOWN MENU (OVERLAY ON TOP) ================= */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 z-50 overflow-hidden transition-all duration-300 ease-in-out bg-white shadow-xl ${
            mobileMenuOpen ? 'max-h-[800px] opacity-100 pt-0 pb-6 px-4 border-b border-border-color/20' : 'max-h-0 opacity-0 py-0 px-4 pointer-events-none'
          }`}
        >
          <div className="flex flex-col">
            {/* Nav Links - Left Aligned */}
            <nav className="flex flex-col items-start text-left font-sans font-medium text-[20px] uppercase">
              <ScrambleLink
                href="/"
                text="HOME"
                isActive={isHomeActive}
                onClick={() => setMobileMenuOpen(false)}
                className="py-[12px] w-full justify-start"
              />
              <ScrambleLink
                href="/how-to-use"
                text="HOW TO USE"
                isActive={isHowToUseActive}
                onClick={() => setMobileMenuOpen(false)}
                className="py-[12px] w-full justify-start"
              />
              <ScrambleLink
                href="/about"
                text="ABOUT ME"
                isActive={isAboutActive}
                onClick={() => setMobileMenuOpen(false)}
                className="py-[12px] w-full justify-start"
              />
            </nav>

            {/* Bottom Section - 150px distance from About Me */}
            <div className="flex flex-col gap-4 mt-[150px]">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 py-[12px] font-sans font-medium text-[20px] text-[#121212] hover:opacity-70"
              >
                <GithubIcon size={20} />
                <span>0</span>
              </a>

              <div className="flex flex-col gap-2 pt-1">
                <h2 className="text-[18px] font-bold text-[#121212]">
                  Unlock Unlimited Access
                </h2>
                <p className="text-[16px] font-normal text-black/75">
                  Sign in for free to copy all GSAP components, remix full templates, and save your favorites.
                </p>

                <div className="pt-2">
                  <SignInButton mode="modal">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3.5 px-6 bg-[#E74E1B] text-white font-bold text-[16px] uppercase rounded-full hover:opacity-90 transition-opacity cursor-pointer border-none text-center select-none"
                    >
                      LOGIN / SIGNUP
                    </button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DARK BACKDROP OVERLAY (70% BLACK) ================= */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`md:hidden fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
    </header>
  )
}

