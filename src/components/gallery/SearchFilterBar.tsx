'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'

interface SearchFilterBarProps {
  value?: string
  onSearchChange?: (value: string) => void
  onFilterClick?: () => void
  className?: string
}

export function SearchFilterBar({
  value = '',
  onSearchChange,
  onFilterClick,
  className = '',
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState(value)

  useEffect(() => {
    setSearchQuery(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (onSearchChange) onSearchChange(val)
  }

  const handleClear = () => {
    setSearchQuery('')
    if (onSearchChange) onSearchChange('')
  }

  return (
    <div className={`w-full flex items-center justify-between mb-[24px] ${className}`}>
      {/* Left side: Search input with icon & Clear button */}
      <div
        className={`flex items-center gap-2.5 py-[4px] transition-all duration-200 origin-left border-b w-[220px] ${
          searchQuery.length > 0 ? 'border-black/20' : 'border-transparent'
        }`}
      >
        <Search size={20} className="text-black/50 shrink-0 select-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search component..."
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

      {/* Right side: Filter button */}
      <button
        onClick={onFilterClick}
        type="button"
        className="flex items-center gap-1.5 py-[4px] bg-transparent border-none outline-none cursor-pointer p-0 m-0 text-[16px] leading-none font-medium text-[#000000] hover:opacity-70 transition-opacity"
      >
        <span>Filter</span>
        <ChevronDown size={20} className="text-[#000000]" />
      </button>
    </div>
  )
}
