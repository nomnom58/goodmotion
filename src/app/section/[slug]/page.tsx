'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { SectionCard } from '@/components/gallery/SectionCard'
import { AuthAction } from '@/components/ui/AuthAction'
import { Share2, Download, Zap, Copy } from 'lucide-react'

const FramerIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7H5z"/>
  </svg>
)
const RELATED_SECTIONS = [
  {
    id: '2',
    slug: 'hero-parallax',
    title: 'Dynamic Hero Parallax Section',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    index: '02'
  },
  {
    id: '3',
    slug: 'sticky-reveal',
    title: 'Sticky Reveal Gallery Component',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop',
    index: '03'
  },
  {
    id: '4',
    slug: 'bento-grid-motion',
    title: 'Animated Bento Grid Layout',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop',
    index: '04'
  }
]

export default function SectionDetailPage() {
  const { slug } = useParams()

  return (
    <div className="flex flex-col pt-0 pb-5">
      {/* Detail Hero */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-4 mb-4 mt-0">
        <h1 className="font-serif text-brand text-[32px] sm:text-[40px] leading-[32px] sm:leading-[40px] text-left sm:w-[350px]">
          Image Split Scroll Animation in Framer
        </h1>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="outline" size="default" borderRadius="md" className="gap-2">
            <Share2 size={16} />
            Share
          </Button>
          <AuthAction message="Sign in to get Webflow link">
            <Button variant="secondary" size="default" borderRadius="16" className="gap-2">
              <Copy size={16} />
              Get Webflow
            </Button>
          </AuthAction>
          <AuthAction message="Sign in to remix in Framer">
            <Button variant="primary" size="default" borderRadius="none" className="gap-2">
              <FramerIcon size={16} />
              Remix Framer
            </Button>
          </AuthAction>
        </div>
      </div>

      {/* Mobile Buttons */}
      <div className="flex sm:hidden items-center gap-2 mb-6">
        <Button variant="outline" size="default" borderRadius="md" className="px-3">
          <Share2 size={16} />
        </Button>
        <AuthAction message="Sign in required" className="flex-1">
          <Button variant="secondary" size="default" borderRadius="16" className="w-full gap-2">
            <Copy size={16} />
            Webflow
          </Button>
        </AuthAction>
        <AuthAction message="Sign in required" className="flex-1">
          <Button variant="primary" size="default" borderRadius="none" className="w-full gap-2">
            <FramerIcon size={16} />
            Remix
          </Button>
        </AuthAction>
      </div>

      {/* Showcase Area */}
      <div className="flex flex-col gap-6">
        {/* Main Preview */}
        <div className="aspect-16-9 w-full bg-tag-bg relative overflow-hidden">
          <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Centered Content Block (600px) */}
        <div className="max-w-[600px] mx-auto w-full flex flex-col gap-6 px-0 text-center items-center">
          {/* Body Text & Metadata */}
          <div className="flex flex-col gap-2">
            <p className="font-serif text-[20px] sm:text-[24px] text-primary-text leading-tight">
              This high-end component features a unique image split effect that reacts to user scroll. 
              Built with GSAP for high performance and seamless integration into Framer or any Webflow project.
              Easily customizable colors, timing, and transition curves.
            </p>
            <span className="font-mono text-[12px] text-secondary-text/60">
              1 month ago
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-10 mt-16 justify-center">
            <Tag>GSAP</Tag>
            <Tag>Scroll Animation</Tag>
            <Tag>Framer</Tag>
            <Tag>Split Effect</Tag>
          </div>
        </div>
      </div>

      {/* Related Content */}
      <section className="flex flex-col gap-6 pt-[100px] border-none pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-6">
          {RELATED_SECTIONS.map((section) => (
            <SectionCard
              key={section.id}
              {...section}
              thumbnailUrl={section.thumbnailUrl}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
