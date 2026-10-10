'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { SectionCard } from './SectionCard'
import { SearchFilterBar } from './SearchFilterBar'
import { FilterState } from './FilterModal'
import { getSections } from '@/actions/sections'
import { SectionCardData } from '@/types/section'

interface SectionListProps {
  initialSections: SectionCardData[]
  initialHasMore: boolean
}

export function SectionList({ initialSections, initialHasMore }: SectionListProps) {
  const [sections, setSections] = useState<SectionCardData[]>(initialSections)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterState, setFilterState] = useState<FilterState>({
    status: 'all',
    categories: [],
  })
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  // Infinite Scroll & Duplicate Fetch Guard refs
  const isLoadingRef = useRef(false)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const handleLoadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return

    // Lock fetch guard
    isLoadingRef.current = true
    setIsLoading(true)

    const nextOffset = sections.length
    const { success, data, hasMore: newHasMore } = await getSections(6, nextOffset)

    if (success && data && data.length > 0) {
      setSections((prev) => [...prev, ...data])
      setHasMore(newHasMore)
    } else {
      setHasMore(false)
    }

    setIsLoading(false)
    isLoadingRef.current = false
  }, [hasMore, sections.length])

  // Filter state handlers
  const handleStatusChange = (status: string) => {
    setFilterState((prev) => ({ ...prev, status }))
  }

  const handleCategoryToggle = (category: string) => {
    setFilterState((prev) => {
      const exists = prev.categories.includes(category)
      const newCats = exists
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories: newCats }
    })
  }

  const handleCategoryAllSelect = () => {
    setFilterState((prev) => ({ ...prev, categories: [] }))
  }

  const handleResetFilters = () => {
    setFilterState({ status: 'all', categories: [] })
    setSearchQuery('')
  }

  const handleApplyMobileFilters = (newStatus: string, newCategories: string[]) => {
    setFilterState({ status: newStatus, categories: newCategories })
  }

  // Filter sections by search query, status, and categories
  const filteredSections = sections.filter((section) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const matchTitle = section.title?.toLowerCase().includes(query)
      const matchDescription = section.description?.toLowerCase().includes(query)
      const matchTags = section.tags?.some((tag) => tag.toLowerCase().includes(query))
      if (!matchTitle && !matchDescription && !matchTags) return false
    }

    if (filterState.categories.length > 0) {
      const sectionCats = [
        ...(section.category ? [section.category] : []),
        ...(section.tags || []),
      ].map((c) => c.toLowerCase())

      const hasMatch = filterState.categories.some((cat) =>
        sectionCats.includes(cat.toLowerCase())
      )
      if (!hasMatch) return false
    }

    if (filterState.status !== 'all') {
      if (filterState.status === 'trending' && !section.is_trending) return false
      if (filterState.status === 'recently' && !section.is_new) return false
    }

    return true
  })

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    filterState.status !== 'all' ||
    filterState.categories.length > 0

  // Attach IntersectionObserver for 100% Seamless Infinite Scroll with Pre-fetching Margin
  useEffect(() => {
    if (!hasMore || hasActiveFilters) return

    const target = observerRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && !isLoadingRef.current) {
          handleLoadMore()
        }
      },
      {
        root: null,
        rootMargin: '300px', // Pre-fetching Margin: triggers 300px before user reaches the bottom
        threshold: 0,
      }
    )

    observer.observe(target)

    return () => {
      if (target) observer.unobserve(target)
    }
  }, [hasMore, hasActiveFilters, handleLoadMore])

  return (
    <div className="flex flex-col pb-20">
      {/* Search & Filter Bar */}
      <SearchFilterBar
        value={searchQuery}
        onSearchChange={setSearchQuery}
        filterState={filterState}
        onStatusChange={handleStatusChange}
        onCategoryToggle={handleCategoryToggle}
        onCategoryAllSelect={handleCategoryAllSelect}
        onResetFilters={handleResetFilters}
        onApplyMobileFilters={handleApplyMobileFilters}
      />

      {/* Empty State UI when search/filter has no results */}
      {filteredSections.length === 0 && hasActiveFilters ? (
        <div className="flex flex-col items-center justify-center py-[64px] px-[24px] text-center w-full bg-white border border-[#000000]/10">
          <div className="relative w-[300px] sm:w-[500px] aspect-[5/3] mb-[24px] sm:mb-[48px]">
            <Image
              src="/empty-state.png"
              alt="No components found"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h3 className="text-[16px] font-bold text-[#000000] mb-[8px] select-none">
            No components found
          </h3>

          <p className="text-[16px] font-medium text-[#000000]/50 max-w-[280px] mb-[24px]">
            No components match your search or filter criteria. Try adjusting your search or clearing your filters.
          </p>

          <button
            onClick={handleResetFilters}
            type="button"
            className="text-[14px] font-bold text-[#E74E1B] uppercase hover:opacity-75 transition-opacity cursor-pointer border-none bg-transparent p-0 m-0 select-none"
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <section className="w-full border border-[#000000]/10 bg-[#000000]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-[1px]">
          {filteredSections.map((section) => (
            <SectionCard key={section.id} {...section} />
          ))}
        </section>
      )}

      {/* Infinite Scroll Sentinel & Custom 4-Square Accent Loading Indicator */}
      {hasMore && !hasActiveFilters && (
        <div ref={observerRef} className="flex flex-col items-center justify-center pt-12 pb-6 select-none">
          {/* 4 Accent Squares (8px x 8px each) fading from 100%, 75%, 50%, 25% with wave pulse animation */}
          <div className="flex items-center gap-[6px] mb-[16px]">
            <span
              className="w-[8px] h-[8px] bg-[#E74E1B] block shrink-0"
              style={{ animation: 'squarePulse 1.2s infinite ease-in-out 0s' }}
            />
            <span
              className="w-[8px] h-[8px] bg-[#E74E1B] opacity-75 block shrink-0"
              style={{ animation: 'squarePulse 1.2s infinite ease-in-out 0.2s' }}
            />
            <span
              className="w-[8px] h-[8px] bg-[#E74E1B] opacity-50 block shrink-0"
              style={{ animation: 'squarePulse 1.2s infinite ease-in-out 0.4s' }}
            />
            <span
              className="w-[8px] h-[8px] bg-[#E74E1B] opacity-25 block shrink-0"
              style={{ animation: 'squarePulse 1.2s infinite ease-in-out 0.6s' }}
            />
          </div>

          {/* Text Loading below */}
          <span className="font-bold text-[16px] text-[#000000]">
            Loading
          </span>
        </div>
      )}
    </div>
  )
}


