'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'

const CHAR_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$&*'

interface CharItem {
  char: string
  isScrambled: boolean
}

interface ScrambleLinkProps {
  href: string
  text: string
  isActive?: boolean
  activeColor?: string
  defaultColor?: string
  accentColor?: string
  duration?: number
  className?: string
  onClick?: () => void
}

export function ScrambleLink({
  href,
  text,
  isActive = false,
  activeColor = '#E74E1B',
  defaultColor = '#121212',
  accentColor = '#E74E1B',
  duration = 0.53,
  className = '',
  onClick,
}: ScrambleLinkProps) {
  const targetText = (text || '').toUpperCase()
  const baseColor = isActive ? activeColor : defaultColor

  const [displayChars, setDisplayChars] = useState<CharItem[]>(() =>
    targetText.split('').map((c) => ({ char: c, isScrambled: false }))
  )
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (tweenRef.current) tweenRef.current.kill()
    setDisplayChars(targetText.split('').map((c) => ({ char: c, isScrambled: false })))
  }, [targetText])

  const playScramble = () => {
    if (tweenRef.current) tweenRef.current.kill()

    const len = targetText.length
    const progressObj = { p: 0 }

    tweenRef.current = gsap.to(progressObj, {
      p: 1,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        const revealCount = Math.floor(progressObj.p * len)
        const nextChars: CharItem[] = []

        for (let i = 0; i < len; i++) {
          if (targetText[i] === ' ') {
            nextChars.push({ char: ' ', isScrambled: false })
          } else if (i < revealCount) {
            nextChars.push({
              char: targetText[i],
              isScrambled: false,
            })
          } else {
            const randomChar = CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]
            nextChars.push({ char: randomChar, isScrambled: true })
          }
        }
        setDisplayChars(nextChars)
      },
      onComplete: () => {
        setDisplayChars(targetText.split('').map((c) => ({ char: c, isScrambled: false })))
      },
    })
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={playScramble}
      className={`no-underline inline-flex items-center select-none cursor-pointer transition-colors duration-150 ${className}`}
      style={{ color: baseColor }}
    >
      <span className="inline-flex whitespace-pre">
        {displayChars.map((item, idx) => (
          <span
            key={idx}
            style={{
              color: item.isScrambled ? accentColor : baseColor,
              transition: 'color 0.1s ease',
            }}
          >
            {item.char}
          </span>
        ))}
      </span>
    </Link>
  )
}
