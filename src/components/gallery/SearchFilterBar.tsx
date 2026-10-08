'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'

interface SearchFilterBarProps {
  onSearchChange?: (value: string) => void
  onFilterClick?: () => void
  className?: string
}

export function SearchFilterBar({
  onSearchChange,
  onFilterClick,
  className = '',
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (onSearchChange) onSearchChange(val)
  }

  return (
    <div className={`w-full flex items-center justify-between mb-[24px] ${className}`}>
      {/* Left side: Search input with icon */}
      <div className="flex items-center gap-2">
        <Search size={16} className="text-black/50 shrink-0 select-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Search"
          className="bg-transparent border-none outline-none text-[14px] font-medium text-[#000000] placeholder:text-black/25 p-0 m-0 w-[180px] sm:w-[260px]"
        />
      </div>

      {/* Right side: Filter button */}
      <button
        onClick={onFilterClick}
        type="button"
        className="flex items-center gap-1.5 bg-transparent border-none outline-none cursor-pointer p-0 m-0 text-[14px] font-medium text-[#000000] hover:opacity-70 transition-opacity"
      >
        <span>Filter</span>
        <ChevronDown size={16} className="text-[#000000]" />
      </button>
    </div>
  )
}
