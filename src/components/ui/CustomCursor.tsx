'use client'

import { useEffect, useState, useRef } from 'react'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  const posRef = useRef({ x: -100, y: -100 })
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Disable custom cursor on mobile / touch devices
    const checkMobile = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth < 1024
      setIsMobile(hasTouch || isSmallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    // Hide OS default cursor on desktop
    document.body.classList.add('custom-cursor-active')

    return () => {
      document.body.classList.remove('custom-cursor-active')
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return

    let animationFrameId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true)
      posRef.current = { x: e.clientX, y: e.clientY }
      
      // Update cursor position smoothly
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target && target.closest('[data-cursor="visit"]')) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile, isVisible])

  if (isMobile || !isVisible) return null

  return (
    <div
      ref={cursorRef}
      style={{
        transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`,
      }}
      className="pointer-events-none fixed top-0 left-0 z-[999999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
    >
      <div
        className={`flex items-center justify-center bg-[#E74E1B] transition-all duration-200 ease-out overflow-hidden shadow-sm ${
          isHovered
            ? 'w-[38px] h-[20px] px-[4px] py-[2px] rounded-[0px]'
            : 'w-[16px] h-[16px] p-0 rounded-[8px]'
        }`}
      >
        <span
          className={`text-[14px] font-bold text-white leading-none whitespace-nowrap select-none transition-opacity duration-150 ${
            isHovered ? 'opacity-100' : 'opacity-0 w-0 h-0 overflow-hidden'
          }`}
        >
          Visit
        </span>
      </div>
    </div>
  )
}
