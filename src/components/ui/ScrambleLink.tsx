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
  const [fixedWidth, setFixedWidth] = useState<number | null>(null)
  const [charWidths, setCharWidths] = useState<number[]>([])

  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const containerRef = useRef<HTMLSpanElement>(null)
  const charRefs = useRef<(HTMLSpanElement | null)[]>([])

  const measureWidths = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      if (rect.width > 0) {
        setFixedWidth(rect.width)
      }
    }
    if (charRefs.current && charRefs.current.length > 0) {
      const widths = charRefs.current.map((el) => {
        if (!el) return 0
        return el.getBoundingClientRect().width
      })
      if (widths.length > 0 && widths.every((w) => w > 0)) {
        setCharWidths(widths)
      }
    }
  }

  useEffect(() => {
    if (tweenRef.current) tweenRef.current.kill()
    setDisplayChars(targetText.split('').map((c) => ({ char: c, isScrambled: false })))
    setFixedWidth(null)
    setCharWidths([])
    const timer = setTimeout(measureWidths, 80)
    return () => clearTimeout(timer)
  }, [targetText])

  const playScramble = () => {
    if (!fixedWidth || charWidths.length === 0) {
      measureWidths()
    }

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
      className={`no-underline inline-flex items-center justify-center select-none cursor-pointer transition-colors duration-150 font-sans ${className}`}
      style={{ color: baseColor }}
    >
      <span
        ref={containerRef}
        className="inline-flex whitespace-pre justify-center items-center overflow-hidden"
        style={{
          width: fixedWidth ? `${fixedWidth}px` : 'auto',
          minWidth: fixedWidth ? `${fixedWidth}px` : undefined,
        }}
      >
        {displayChars.map((item, idx) => {
          const slotWidth = charWidths[idx]
          return (
            <span
              key={idx}
              ref={(el) => {
                charRefs.current[idx] = el
              }}
              className="inline-flex justify-center items-center text-center overflow-hidden"
              style={{
                width: slotWidth && slotWidth > 0 ? `${slotWidth}px` : 'auto',
                minWidth: slotWidth && slotWidth > 0 ? `${slotWidth}px` : undefined,
                color: item.isScrambled ? accentColor : baseColor,
                transition: 'color 0.1s ease',
              }}
            >
              {item.char}
            </span>
          )
        })}
      </span>
    </Link>
  )
}
