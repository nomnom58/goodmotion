'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { FilterModal, FilterState } from './FilterModal'

interface SearchFilterBarProps {
  value?: string
  onSearchChange?: (value: string) => void
  filterState: FilterState
  onStatusChange: (status: string) => void
  onCategoryToggle: (category: string) => void
  onCategoryAllSelect: () => void
  onResetFilters: () => void
  onApplyMobileFilters?: (newStatus: string, newCategories: string[]) => void
  className?: string
}

export function SearchFilterBar({
  value = '',
  onSearchChange,
  filterState,
  onStatusChange,
  onCategoryToggle,
  onCategoryAllSelect,
  onResetFilters,
  onApplyMobileFilters,
  className = '',
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState(value)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [placeholder, setPlaceholder] = useState('Search component...')
  const filterButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setSearchQuery(value)
  }, [value])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPlaceholder('Search')
      } else {
        setPlaceholder('Search component...')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (onSearchChange) onSearchChange(val)
  }

  const handleClear = () => {
    setSearchQuery('')
    if (onSearchChange) onSearchChange('')
  }

  // Calculate active filter count
  const activeCount =
    (filterState.status !== 'all' ? 1 : 0) + filterState.categories.length

  return (
    <div className={`w-full flex items-center justify-between mb-[12px] ${className}`}>
      {/* Left side: Search input with icon & Clear button */}
      <div
        className={`flex items-center gap-2.5 py-[4px] transition-all duration-200 origin-left border-b ${
          searchQuery.length > 0
            ? 'w-[180px] sm:w-[220px] border-black/20'
            : 'w-[220px] border-transparent'
        }`}
      >
        <Search size={20} className="text-black/50 shrink-0 select-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none text-[16px] leading-none font-medium text-[#000000] placeholder:text-black/25 p-0 m-0 flex-1 min-w-0 h-5"
        />
        {searchQuery.length > 0 && (
          <button
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
            className="px-[4px] py-[2px] bg-black/75 text-white text-[14px] font-bold leading-none border-none cursor-pointer hover:opacity-90 transition-opacity shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right side: Reset button & Filter button with FilterModal */}
      <div className="relative flex items-center gap-3">
        {/* Reset button outside bar when active filters > 0 */}
        {activeCount > 0 && (
          <button
            onClick={onResetFilters}
            type="button"
            className="text-[#E74E1B] text-[16px] font-medium leading-none hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent p-0 m-0 select-none"
          >
            Reset
          </button>
        )}

        {/* Filter Trigger Button */}
        <button
          ref={filterButtonRef}
          onClick={() => setIsFilterOpen((prev) => !prev)}
          type="button"
          className="flex items-center gap-1.5 py-[4px] bg-transparent border-none outline-none cursor-pointer p-0 m-0 text-[16px] leading-none font-medium text-[#000000] hover:opacity-70 transition-opacity select-none"
        >
          <span>
            Filter{activeCount > 0 ? ` (${activeCount})` : ''}
          </span>
          <ChevronDown
            size={20}
            className={`text-[#000000] transition-transform duration-200 ${
              isFilterOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Filter Dropdown Modal */}
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filterState={filterState}
          onStatusChange={onStatusChange}
          onCategoryToggle={onCategoryToggle}
          onCategoryAllSelect={onCategoryAllSelect}
          onApplyMobileFilters={onApplyMobileFilters}
          triggerRef={filterButtonRef}
        />
      </div>
    </div>
  )
}

