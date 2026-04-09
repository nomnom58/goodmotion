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
  description,
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
          // Optimization: Once rendered, we can keep it or disconnect 
          // but for dynamic large lists, keeping it might be better 
          // to un-render off-screen ones too.
        } else {
          setIsNearViewport(false)
        }
      },
      { rootMargin: '500px' } // Pre-render when 500px close
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
      { threshold: 0.6 } // Play when 60% of card is visible
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isMobile])

  // Handle Video Play/Pause
  useEffect(() => {
    if (!videoRef.current || !videoUrl || !isNearViewport) return

    const shouldPlay = isMobile ? isInView : isHovered

    if (shouldPlay) {
      videoRef.current.play().catch(() => {
        // Handle potential autoplay restrictions
      })
    } else {
      videoRef.current.pause()
      // Optimization: Don't resetting currentTime to 0 on mobile for smoother experience
      if (!isMobile) videoRef.current.currentTime = 0
    }
  }, [isHovered, isInView, isMobile, videoUrl, isNearViewport])

  // Handle Thumbnail Fallback: If no thumbnailUrl but has videoUrl, 
  // we use the video itself (static or autoplay)
  const hasThumbnail = thumbnailUrl && thumbnailUrl !== ''
  const showVideo = !!videoUrl && isNearViewport && (isMobile ? true : isHovered || !hasThumbnail)

  return (
    <Link
      href={`/section/${slug}`}
      className="group block transition-all"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="flex flex-col gap-3" ref={containerRef}>
        {/* Container for Image/Video */}
        <div className="relative aspect-16-9 w-full overflow-hidden bg-tag-bg group-hover:shadow-card-hover transition-shadow rounded-sm">
          {showVideo ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              poster={thumbnailUrl}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                (isMobile || isHovered || !hasThumbnail) ? "opacity-100" : "opacity-0"
              )}
            />
          ) : null}

          {/* Show Image if not currently showing video or as a fallback */}
          {hasThumbnail && (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              unoptimized
              className={cn(
                "object-cover transition-opacity duration-300",
                (showVideo && (isHovered || (isMobile && isInView) || !hasThumbnail)) ? "opacity-0" : "opacity-100"
              )}
              loading="lazy"
            />
          )}

          {/* If no thumbnail and no video showing yet, show a placeholder or the first frame of video */}
          {!hasThumbnail && !showVideo && (
            <div className="absolute inset-0 bg-tag-bg flex items-center justify-center">
              <span className="text-secondary-text text-xs">Preview</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-medium text-primary-text flex gap-2">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
