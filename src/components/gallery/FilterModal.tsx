'use client'

import React, { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Medal, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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
  onApplyMobileFilters?: (newStatus: string, newCategories: string[]) => void
  className?: string
}

// Icons for Status pills
const GreenAtIcon = () => (
  <span className="font-bold text-[#22C55E] text-[15px] select-none leading-none">@</span>
)

const OrangeMedalIcon = () => (
  <Medal size={15} className="text-[#EA580C] shrink-0 stroke-[2.2]" />
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
  onApplyMobileFilters,
  className = '',
}: FilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const mobileModalRef = useRef<HTMLDivElement>(null)
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom')
  const [mounted, setMounted] = useState(false)

  // Mobile draft state
  const [mobileDraft, setMobileDraft] = useState<FilterState>({
    status: filterState.status,
    categories: [...filterState.categories],
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when mobile modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen])

  // Sync mobile draft state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setMobileDraft({
        status: filterState.status,
        categories: [...filterState.categories],
      })
    }
  }, [isOpen, filterState])

  // Smart positioning for desktop popover
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

  // Close modal when clicking outside on desktop
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        modalRef.current?.contains(target) ||
        mobileModalRef.current?.contains(target)
      ) {
        return
      }
      onClose()
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
    { id: 'trending', label: 'Trending', icon: <OrangeMedalIcon />, disabled: false },
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

  // Mobile handlers
  const handleMobileStatusChange = (id: string) => {
    setMobileDraft((prev) => ({ ...prev, status: id }))
  }

  const handleMobileCategoryToggle = (cat: string) => {
    setMobileDraft((prev) => {
      const exists = prev.categories.includes(cat)
      const newCats = exists
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat]
      return { ...prev, categories: newCats }
    })
  }

  const handleMobileCategoryAllSelect = () => {
    setMobileDraft((prev) => ({ ...prev, categories: [] }))
  }

  const handleMobileReset = () => {
    setMobileDraft({ status: 'all', categories: [] })
  }

  const handleMobileApply = () => {
    if (onApplyMobileFilters) {
      onApplyMobileFilters(mobileDraft.status, mobileDraft.categories)
    } else {
      // Fallback
      onStatusChange(mobileDraft.status)
      if (mobileDraft.categories.length === 0) {
        onCategoryAllSelect()
      }
    }
    onClose()
  }

  const isDesktopAllCategories = filterState.categories.length === 0
  const isMobileAllCategories = mobileDraft.categories.length === 0

  const positionClasses =
    placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'

  const mobilePortalMarkup = mounted
    ? createPortal(
        <div
          ref={mobileModalRef}
          className="md:hidden fixed inset-0 z-[99999] w-full h-[100dvh] max-h-[100dvh] bg-white p-[16px] pt-[max(16px,env(safe-area-inset-top,16px))] pb-[max(16px,env(safe-area-inset-bottom,16px))] rounded-none flex flex-col overflow-y-auto animate-slide-up-fullscreen"
        >
          {/* Mobile Header: Title & 24px X Icon */}
          <div className="flex items-center justify-between shrink-0 mb-6">
            <h2 className="text-[24px] font-bold text-[#000000] tracking-[-0.03em] p-0 m-0 leading-tight select-none">
              Filter
            </h2>
            <button
              onClick={onClose}
              type="button"
              aria-label="Close filter modal"
              className="p-1 text-[#000000] hover:opacity-70 transition-opacity border-none bg-transparent cursor-pointer"
            >
              <X size={24} className="stroke-[2]" />
            </button>
          </div>

          {/* Mobile Section 1: Status */}
          <div className="flex flex-col gap-[10px] mb-6">
            <span className="text-[14px] font-medium text-[#000000]/50 tracking-[-0.02em] select-none">
              Status
            </span>
            <div className="flex flex-col gap-[8px] items-start">
              {statusItems.map((item) => {
                const isActive = mobileDraft.status === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => !item.disabled && handleMobileStatusChange(item.id)}
                    disabled={item.disabled}
                    type="button"
                    className={`flex items-center gap-[8px] px-[14px] py-[9px] rounded-[24px] text-[16px] font-medium transition-all duration-150 border cursor-pointer select-none leading-none ${
                      item.disabled
                        ? 'bg-white border-[#000000]/10 text-[#000000]/30 cursor-not-allowed opacity-50'
                        : isActive
                        ? 'bg-[#E74E1B]/[0.05] border-[#E74E1B] text-[#E74E1B]'
                        : 'bg-white border-[#000000]/10 text-[#000000] hover:bg-[#000000]/5'
                    }`}
                  >
                    {isActive ? (
                      <span className="w-4 h-4 rounded-full bg-[#E74E1B] flex items-center justify-center shrink-0">
                        <Check size={11} className="text-white stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-[#000000]/20 shrink-0 bg-transparent" />
                    )}
                    {item.icon && <span className="flex items-center shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mobile Section 2: Category */}
          <div className="flex flex-col gap-[10px]">
            <span className="text-[14px] font-medium text-[#000000]/50 tracking-[-0.02em] select-none">
              Category
            </span>
            <div className="flex flex-wrap gap-[8px] items-center">
              <button
                onClick={handleMobileCategoryAllSelect}
                type="button"
                className={`px-[14px] py-[9px] rounded-[24px] text-[16px] font-medium transition-all duration-150 border cursor-pointer select-none leading-none ${
                  isMobileAllCategories
                    ? 'bg-[#E74E1B]/[0.05] border-[#E74E1B] text-[#E74E1B]'
                    : 'bg-white border-[#000000]/10 text-[#000000] hover:bg-[#000000]/5'
                }`}
              >
                All category
              </button>

              {categoryList.map((cat) => {
                const isActive = mobileDraft.categories.includes(cat)

                return (
                  <button
                    key={cat}
                    onClick={() => handleMobileCategoryToggle(cat)}
                    type="button"
                    className={`px-[14px] py-[9px] rounded-[24px] text-[16px] font-medium transition-all duration-150 border cursor-pointer select-none leading-none ${
                      isActive
                        ? 'bg-[#E74E1B]/[0.05] border-[#E74E1B] text-[#E74E1B]'
                        : 'bg-white border-[#000000]/10 text-[#000000] hover:bg-[#000000]/5'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mobile Footer: 2 Action Buttons placed 32px below Category */}
          <div className="grid grid-cols-2 gap-3 mt-[32px] shrink-0">
            <Button
              variant="ghost"
              borderRadius="full"
              size="lg"
              onClick={handleMobileReset}
              className="w-full py-3 text-[16px] font-bold"
            >
              Reset
            </Button>
            <Button
              variant="accent"
              borderRadius="full"
              size="lg"
              onClick={handleMobileApply}
              className="w-full py-3 text-[16px] font-bold"
            >
              Apply
            </Button>
          </div>
        </div>,
        document.body
      )
    : null

  return (
    <>
      {/* MOBILE FULL-SCREEN OVERLAY (Rendered via Portal to document.body) */}
      {mobilePortalMarkup}

      {/* DESKTOP POPOVER DROPDOWN (>= md) */}
      <div
        ref={modalRef}
        className={`hidden md:flex absolute right-0 ${positionClasses} w-[400px] max-w-[90vw] bg-white border border-[#000000] p-[16px] z-50 rounded-none flex-col ${className}`}
      >
        <h2 className="text-[20px] font-bold text-[#000000] tracking-[-0.03em] p-0 m-0 leading-tight mb-[16px] select-none">
          Filter
        </h2>

        {/* Section 1: Status */}
        <div className="flex flex-col mb-[16px]">
          <span className="text-[14px] font-medium text-[#000000]/50 tracking-[-0.02em] mb-[8px] select-none">
            Status
          </span>
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
                  {isActive ? (
                    <span className="w-4 h-4 rounded-full bg-[#E74E1B] flex items-center justify-center shrink-0">
                      <Check size={11} className="text-white stroke-[3]" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-[#000000]/20 shrink-0 bg-transparent" />
                  )}
                  {item.icon && <span className="flex items-center shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 2: Category */}
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-[#000000]/50 tracking-[-0.02em] mb-[8px] select-none">
            Category
          </span>
          <div className="flex flex-wrap gap-[8px] items-center">
            <button
              onClick={onCategoryAllSelect}
              type="button"
              className={`px-[12px] py-[8px] rounded-[24px] text-[16px] font-medium transition-all duration-150 border cursor-pointer select-none leading-none ${
                isDesktopAllCategories
                  ? 'bg-[#E74E1B]/[0.05] border-[#E74E1B] text-[#E74E1B]'
                  : 'bg-white border-[#000000]/10 text-[#000000] hover:bg-[#000000]/5 hover:border-[#000000]/10'
              }`}
            >
              All category
            </button>

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
    </>
  )
}



