'use client'
import { useState } from 'react'
import { SectionCard } from './SectionCard'
import { Button } from '@/components/ui/Button'
import { getSections } from '@/actions/sections'
import { SectionCardData } from '@/types/section'

interface SectionListProps {
  initialSections: SectionCardData[]
  initialHasMore: boolean
}

export function SectionList({ initialSections, initialHasMore }: SectionListProps) {
  const [sections, setSections] = useState<SectionCardData[]>(initialSections)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    const nextOffset = sections.length
    const { success, data, hasMore: newHasMore } = await getSections(6, nextOffset)

    if (success && data) {
      setSections((prev) => [...prev, ...data])
      setHasMore(newHasMore)
    }
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col gap-10 pb-20">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-6">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            {...section}
          />
        ))}
      </section>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="primary"
            onClick={handleLoadMore}
            disabled={isLoading}
            className="!bg-[#E8E8E8] !text-primary-text hover:!opacity-80 border-none px-10 py-3 text-[14px] font-medium"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}
