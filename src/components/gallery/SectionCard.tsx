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
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isHovered && videoRef.current && videoUrl) {
      videoRef.current.play().catch(() => {})
    } else if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isHovered, videoUrl])

  return (
    <Link
      href={`/section/${slug}`}
      className="group block transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-3">
        {/* Placeholder for 16:9 Image/Video */}
        <div className="relative aspect-16-9 w-full overflow-hidden bg-tag-bg group-hover:shadow-card-hover transition-shadow">
          {videoUrl && isHovered ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              loading="lazy"
            />
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
