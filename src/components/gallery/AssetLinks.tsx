'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { AuthAction } from '@/components/ui/AuthAction'
import { getProtectedLinks } from '@/actions/sections'
import { Copy, Zap } from 'lucide-react'

// Custom Framer Icon
const FramerIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7H5z"/>
  </svg>
)

interface AssetLinksProps {
  sectionId: string
  hasWebflow: boolean
}

export function AssetLinks({ sectionId, hasWebflow }: AssetLinksProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleGetLink = (type: 'remix' | 'webflow') => {
    setError(null)
    startTransition(async () => {
      const result = await getProtectedLinks(sectionId)
      
      if (result.success && result.data) {
        const url = type === 'remix' ? result.data.remix_link : result.data.webflow_link
        if (url) {
          window.open(url, '_blank')
        } else {
          setError('Link not available')
        }
      } else {
        setError(result.error?.message || 'Failed to fetch link')
      }
    })
  }

  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto">
      <div className="flex items-center gap-2">
        {/* Webflow Button */}
        {hasWebflow && (
          <AuthAction message="Sign in to get Webflow link" className="flex-1 sm:flex-none">
            <Button 
              variant="secondary" 
              size="default" 
              borderRadius="16" 
              className="gap-2 w-full sm:w-auto"
              disabled={isPending}
              onClick={() => handleGetLink('webflow')}
            >
              <Copy size={16} />
              <span className="hidden sm:inline">Get Webflow</span>
              <span className="sm:hidden">Webflow</span>
            </Button>
          </AuthAction>
        )}

        {/* Remix Button */}
        <AuthAction message="Sign in to remix in Framer" className="flex-1 sm:flex-none">
          <Button 
            variant="primary" 
            size="default" 
            borderRadius="none" 
            className="gap-2 w-full sm:w-auto"
            disabled={isPending}
            onClick={() => handleGetLink('remix')}
          >
            <FramerIcon size={16} />
            <span className="hidden sm:inline">Remix Framer</span>
            <span className="sm:hidden">Remix</span>
          </Button>
        </AuthAction>
      </div>
      
      {error && (
        <p className="text-red-500 text-[10px] font-mono mt-1 text-center sm:text-right">
          {error}
        </p>
      )}
      
      {isPending && (
        <p className="text-secondary-text text-[10px] font-mono mt-1 text-center sm:text-right animate-pulse">
          Fetching secure link...
        </p>
      )}
    </div>
  )
}
