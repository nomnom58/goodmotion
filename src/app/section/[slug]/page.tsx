import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { SectionCard } from '@/components/gallery/SectionCard'
import { AssetLinks } from '@/components/gallery/AssetLinks'
import { Share2 } from 'lucide-react'
import { getSectionDetail } from '@/actions/sections'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600 // Revalidate every hour

export default async function SectionDetailPage({ params }: PageProps) {
  const { slug } = await params
  const { success, data, error } = await getSectionDetail(slug)

  if (!success || !data) {
    if (error?.code === 'SEC_404') {
      notFound()
    }
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-secondary-text font-mono">Failed to load section detail. Please try again.</p>
      </div>
    )
  }

  const { section, related } = data
  const assets = section.preview_assets
  const thumb_url = assets?.thumb_url
  const video_url = assets?.video_url

  // Date formatting (using a fallback string if no date-fns)
  const timeAgo = section.created_at 
    ? new Date(section.created_at).toLocaleDateString() // Keeping it simple
    : 'Recently'

  return (
    <div className="flex flex-col pt-0 pb-5">
      {/* Detail Hero */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-4 mb-4 mt-0">
        <h1 className="font-serif text-brand text-[40px] leading-[40px] text-left sm:max-w-[350px]">
          {section.title}
        </h1>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="outline" size="default" borderRadius="md" className="gap-2">
            <Share2 size={16} />
            Share
          </Button>
          <AssetLinks 
            sectionId={section.id} 
            hasWebflow={!!section.webflow_link} 
          />
        </div>
      </div>

      {/* Mobile Buttons */}
      <div className="flex sm:hidden items-center gap-2 mb-6 w-full">
        <Button variant="outline" size="default" borderRadius="md" className="px-3 h-[44px]">
          <Share2 size={16} />
        </Button>
        <div className="flex-1">
          <AssetLinks 
            sectionId={section.id} 
            hasWebflow={!!section.webflow_link} 
          />
        </div>
      </div>

      {/* Showcase Area */}
      <div className="flex flex-col gap-6">
        {/* Main Preview */}
        <div className="aspect-16-9 w-full bg-tag-bg relative overflow-hidden rounded-sm">
          {video_url ? (
            <video
              src={video_url}
              autoPlay
              muted
              loop
              playsInline
              poster={thumb_url}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : thumb_url ? (
            <img 
              src={thumb_url} 
              alt={section.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* Fallback Black Div if no asset at all */
            <div className="absolute inset-0 bg-[#000000] flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                <span className="text-white/20 text-[10px] font-mono">!</span>
              </div>
              <span className="text-white/30 text-[10px] font-mono tracking-tight uppercase">
                Preview not available
              </span>
            </div>
          )}
        </div>

        {/* Centered Content Block (600px) */}
        <div className="max-w-[600px] mx-auto w-full flex flex-col gap-6 px-0 text-center items-center">
          {/* Body Text & Metadata */}
          <div className="flex flex-col gap-2">
            <p className="font-serif text-[20px] sm:text-[24px] text-primary-text leading-tight">
              {section.body_text}
            </p>
            <span className="font-mono text-[12px] text-secondary-text/60">
              {timeAgo}
            </span>
          </div>

          {/* Tags from DB */}
          {(section.tags && section.tags.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-10 mt-16 justify-center">
              {section.tags.map((tag, i) => (
                <Tag key={i}>{tag}</Tag>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Content */}
      {related.length > 0 && (
        <section className="flex flex-col gap-6 pt-[100px] border-none pb-20">
          <h2 className="font-mono text-[14px] text-secondary-text uppercase tracking-wider mb-2">
            Related in {section.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-6">
            {related.map((item) => (
              <SectionCard
                key={item.id}
                {...item}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
