'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Tooltip({ children, content, open, onOpenChange }: TooltipProps) {
  const [show, setShow] = React.useState(open ?? false)

  React.useEffect(() => {
    if (open !== undefined) setShow(open)
  }, [open])

  return (
    <div 
      className="relative flex items-center group"
      onMouseEnter={() => !open && setShow(true)}
      onMouseLeave={() => !open && setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[100] whitespace-nowrap">
          <div className="bg-[#1F1F1F] text-white text-[12px] px-3 py-1.5 rounded-sm font-mono shadow-md animate-in fade-in slide-in-from-bottom-1 duration-200">
            {content}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1F1F1F]" />
          </div>
        </div>
      )}
    </div>
  )
}
