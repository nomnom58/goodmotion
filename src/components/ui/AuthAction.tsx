'use client'

import { useAuth } from '@clerk/nextjs'
import { useState, useCallback } from 'react'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'

interface AuthActionProps {
  children: React.ReactElement
  message?: string
  className?: string
}

export function AuthAction({ children, message = 'Sign in to access this feature', className }: AuthActionProps) {
  const { isSignedIn } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isSignedIn) {
      e.preventDefault()
      e.stopPropagation()
      setIsOpen(true)
      setTimeout(() => setIsOpen(false), 3000)
    }
  }, [isSignedIn])

  if (isSignedIn) return children

  return (
    <Tooltip content={message} open={isOpen} onOpenChange={setIsOpen}>
      <div onClickCapture={handleClick} className={cn("w-full flex", className)}>
        <div className="pointer-events-none w-full flex">
          {children}
        </div>
      </div>
    </Tooltip>
  )
}
