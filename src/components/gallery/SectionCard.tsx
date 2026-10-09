'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  id: string
  slug: string
  title: string
  description?: string
  thumbnailUrl: string
  videoUrl?: string
  index?: string
}

export function SectionCard({
  slug,
  title,
  thumbnailUrl,
  videoUrl,
  index,
}: SectionCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Intersection Observer for Lazy Rendering (Video)
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true)
        } else {
          setIsNearViewport(false)
        }
      },
      { rootMargin: '500px' }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Intersection Observer for Mobile Autoplay
  useEffect(() => {
    if (!isMobile || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.6 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isMobile])

  // Handle Video Play/Pause
  useEffect(() => {
    if (!videoRef.current || !videoUrl || !isNearViewport) return

    const shouldPlay = isMobile ? isInView : isHovered

    if (shouldPlay) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
      if (!isMobile) videoRef.current.currentTime = 0
    }
  }, [isHovered, isInView, isMobile, videoUrl, isNearViewport])

  const hasThumbnail = !!thumbnailUrl && thumbnailUrl !== ''
  const showVideo = !isMobile && isHovered && !!videoUrl && isNearViewport

  return (
    <Link
      href={`/section/${slug}`}
      data-cursor="visit"
      className="group block transition-colors bg-white hover:bg-[#000000]/5 p-[24px] h-full"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="flex flex-col h-full" ref={containerRef}>
        {/* Container for Image/Video (16:9, rounded-none, bg-white) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-white rounded-none">
          {showVideo ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              preload="none"
              poster={thumbnailUrl}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-all duration-300 z-10 group-hover:scale-105",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            />
          ) : null}

          {/* Thumbnail Image with zoom/scale effect */}
          {hasThumbnail ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className={cn(
                "object-cover transition-transform duration-300 group-hover:scale-105",
                (showVideo && isHovered) ? "opacity-0" : "opacity-100"
              )}
              loading={index && parseInt(index) <= 2 ? undefined : "lazy"}
              priority={index ? parseInt(index) <= 2 : false}
            />
          ) : (
            /* Fallback Black Div if no thumbnail */
            <div className="absolute inset-0 bg-[#000000] flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                <span className="text-white/20 text-[10px] font-mono">!</span>
              </div>
              <span className="text-white/30 text-[10px] font-mono tracking-tight uppercase">
                Missing Thumbnail
              </span>
            </div>
          )}
        </div>

        {/* Title (mt-16px, text-14px, font-medium, text-[#000000]) */}
        <div className="mt-[16px] flex flex-col">
          <h3 className="font-sans font-medium text-[14px] text-[#000000] select-none">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
