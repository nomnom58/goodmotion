'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Check } from 'lucide-react'

export interface FilterState {
  status: string // 'all' | 'recently' | 'trending' | 'most_copied' | 'recommend'
  categories: string[] // e.g. ['Text', 'Hover', 'Cursor', 'Scroll', '3D', 'Interaction']
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filterState: FilterState
  onStatusChange: (status: string) => void
  onCategoryToggle: (category: string) => void
  onCategoryAllSelect: () => void
  className?: string
}

// Icons for Status pills
const GreenAtIcon = () => (
  <span className="font-bold text-[#22C55E] text-[15px] select-none leading-none">@</span>
)

const OrangeRibbonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const BlueBookmarkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const PurpleThumbIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
)

export function FilterModal({
  isOpen,
  onClose,
  filterState,
  onStatusChange,
  onCategoryToggle,
  onCategoryAllSelect,
  className = '',
}: FilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom')

  // Smart positioning: check if space below is sufficient, else pop up
  useEffect(() => {
    if (!isOpen) return

    const checkPlacement = () => {
      if (!modalRef.current) return
      const parentEl = modalRef.current.parentElement
      if (!parentEl) return

      const parentRect = parentEl.getBoundingClientRect()
      const spaceBelow = window.innerHeight - parentRect.bottom
      const spaceAbove = parentRect.top
      const modalHeight = modalRef.current.offsetHeight || 380

      if (spaceBelow < modalHeight && spaceAbove > spaceBelow) {
        setPlacement('top')
      } else {
        setPlacement('bottom')
      }
    }

    checkPlacement()
    window.addEventListener('resize', checkPlacement)
    window.addEventListener('scroll', checkPlacement, true)

    return () => {
      window.removeEventListener('resize', checkPlacement)
      window.removeEventListener('scroll', checkPlacement, true)
    }
  }, [isOpen])

  // Close modal when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const statusItems = [
    { id: 'all', label: 'All', icon: null, disabled: false },
    { id: 'recently', label: 'Recently Added', icon: <GreenAtIcon />, disabled: false },
    { id: 'trending', label: 'Trending', icon: <OrangeRibbonIcon />, disabled: false },
    { id: 'most_copied', label: 'Most Copied', icon: <BlueBookmarkIcon />, disabled: false },
    { id: 'recommend', label: 'Recommend (Coming)', icon: <PurpleThumbIcon />, disabled: true },
  ]

  const categoryList = [
    'Text',
    'Hover',
    'Cursor',
    'Scroll',
    '3D',
    'Interaction',
  ]

  const isAllCategories = filterState.categories.length === 0

  const positionClasses =
    placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'

  return (
    <div
      ref={modalRef}
      className={`absolute right-0 ${positionClasses} w-[400px] max-w-[90vw] bg-white border border-[#000000] p-[16px] z-50 rounded-none flex flex-col ${className}`}
    >
      {/* 2. Tiêu đề "Filter" - Font size 20px, Weight 700, Color #000000 */}
      {/* Khoảng cách giữa title filter và Status: 16px (mb-[16px]) */}
      <h2 className="text-[20px] font-bold text-[#000000] tracking-[-0.03em] p-0 m-0 leading-tight mb-[16px] select-none">
        Filter
      </h2>

      {/* Section 1: Status */}
      {/* Khoảng cách giữa nhóm Status và nhóm Category: 16px (mb-[16px]) */}
      <div className="flex flex-col mb-[16px]">
        {/* Sub-header "Status" - Font size 14px, Weight 500, Color 000000 50% */}
        <span className="text-[14px] font-medium text-[#000000]/50 tracking-[-0.02em] mb-[8px] select-none">
          Status
        </span>
        {/* 3. Quy chuẩn Pill Status (Hàng dọc) - khoảng cách giữa các pill: 8px */}
        <div className="flex flex-col gap-[8px] items-start">
          {statusItems.map((item) => {
            const isActive = filterState.status === item.id

            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && onStatusChange(item.id)}
                disabled={item.disabled}
                type="button"
                className={`flex items-center gap-[8px] px-[12px] py-[8px] rounded-[24px] text-[16px] font-medium transition-all duration-150 border cursor-pointer select-none leading-none ${
                  item.disabled
                    ? 'bg-white border-[#000000]/10 text-[#000000]/30 cursor-not-allowed opacity-50'
                    : isActive
                    ? 'bg-[#E74E1B]/[0.05] border-[#E74E1B] text-[#E74E1B]'
                    : 'bg-white border-[#000000]/10 text-[#000000] hover:bg-[#000000]/5 hover:border-[#000000]/10'
                }`}
              >
                {/* Radio / Check Circle Icon */}
                {isActive ? (
                  <span className="w-4 h-4 rounded-full bg-[#E74E1B] flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white stroke-[3]" />
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full border border-[#000000]/20 shrink-0 bg-transparent" />
                )}

                {/* Optional Custom Colored Icon */}
                {item.icon && <span className="flex items-center shrink-0">{item.icon}</span>}

                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Section 2: Category */}
      <div className="flex flex-col">
        {/* Sub-header "Category" - Font size 14px, Weight 500, Color 000000 50% */}
        <span className="text-[14px] font-medium text-[#000000]/50 tracking-[-0.02em] mb-[8px] select-none">
          Category
        </span>
        <div className="flex flex-wrap gap-[8px] items-center">
          {/* All Category Pill */}
          <button
            onClick={onCategoryAllSelect}
            type="button"
            className={`px-[12px] py-[8px] rounded-[24px] text-[16px] font-medium transition-all duration-150 border cursor-pointer select-none leading-none ${
              isAllCategories
                ? 'bg-[#E74E1B]/[0.05] border-[#E74E1B] text-[#E74E1B]'
                : 'bg-white border-[#000000]/10 text-[#000000] hover:bg-[#000000]/5 hover:border-[#000000]/10'
            }`}
          >
            All category
          </button>

          {/* Individual Category Pills */}
          {categoryList.map((cat) => {
            const isActive = filterState.categories.includes(cat)

            return (
              <button
                key={cat}
                onClick={() => onCategoryToggle(cat)}
                type="button"
                className={`px-[12px] py-[8px] rounded-[24px] text-[16px] font-medium transition-all duration-150 border cursor-pointer select-none leading-none ${
                  isActive
                    ? 'bg-[#E74E1B]/[0.05] border-[#E74E1B] text-[#E74E1B]'
                    : 'bg-white border-[#000000]/10 text-[#000000] hover:bg-[#000000]/5 hover:border-[#000000]/10'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}


