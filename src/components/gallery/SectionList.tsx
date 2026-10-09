'use client'

import { useState } from 'react'
import { SectionCard } from './SectionCard'
import { SearchFilterBar } from './SearchFilterBar'
import { Button } from '@/components/ui/Button'
import { getSections } from '@/actions/sections'
import { SectionCardData } from '@/types/section'

interface SectionListProps {
  initialSections: SectionCardData[]
  initialHasMore: boolean
}

export function SectionList({ initialSections, initialHasMore }: SectionListProps) {
  const [sections, setSections] = useState<SectionCardData[]>(initialSections)
  const [searchQuery, setSearchQuery] = useState('')
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

  // Filter sections case-insensitively by title, description, or tags
  const filteredSections = sections.filter((section) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase().trim()

    const matchTitle = section.title?.toLowerCase().includes(query)
    const matchDescription = section.description?.toLowerCase().includes(query)
    const matchTags = section.tags?.some((tag) => tag.toLowerCase().includes(query))

    return matchTitle || matchDescription || matchTags
  })

  return (
    <div className="flex flex-col pb-20">
      {/* Search & Filter Bar */}
      <SearchFilterBar
        value={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Empty State UI when search has no results */}
      {filteredSections.length === 0 && searchQuery.trim() !== '' ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[16px] font-medium text-black/70 mb-4">
            No components found matching &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            onClick={() => setSearchQuery('')}
            type="button"
            className="px-6 py-2.5 bg-[#121212] text-white text-[14px] font-medium rounded-full hover:opacity-80 transition-opacity cursor-pointer border-none"
          >
            Reset Search
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
          {filteredSections.map((section) => (
            <SectionCard key={section.id} {...section} />
          ))}
        </section>
      )}

      {hasMore && filteredSections.length > 0 && searchQuery.trim() === '' && (
        <div className="flex justify-center mt-10">
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
