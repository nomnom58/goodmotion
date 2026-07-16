'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { AuthAction } from '@/components/ui/AuthAction'
import { getProtectedLinks } from '@/actions/sections'
import { Copy, Zap } from 'lucide-react'
import posthog from 'posthog-js'
import { useToast } from '@/components/ui/Toast'


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
  hasRemix: boolean
  hasFramerComponent: boolean
}

export function AssetLinks({ sectionId, hasWebflow, hasRemix, hasFramerComponent }: AssetLinksProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const handleGetLink = (type: 'remix' | 'webflow') => {
    setError(null)
    
    // Capture the click event in PostHog
    posthog.capture('click_remix_button', {
      sectionId,
      type
    })

    startTransition(async () => {
      try {
        const result = await getProtectedLinks(sectionId)
        
        if (result.success && result.data) {
          const url = type === 'remix' ? result.data.remix_link : result.data.webflow_link
          if (url) {
            window.open(url, '_blank')
          } else {
            const errMsg = 'Link not available'
            setError(errMsg)
            showToast('fail', 'Fail', errMsg)
          }
        } else {
          const errMsg = result.error?.message || 'Failed to fetch link'
          setError(errMsg)
          showToast('fail', 'Fail', errMsg)
        }
      } catch (err: any) {
        const errMsg = err?.message || 'An unexpected error occurred'
        setError(errMsg)
        showToast('fail', 'Fail', errMsg)
      }
    })
  }

  const handleCopyComponent = () => {
    setError(null)

    // Capture the copy component click event in PostHog
    posthog.capture('click_copy_component_button', {
      sectionId
    })

    startTransition(async () => {
      try {
        const result = await getProtectedLinks(sectionId)
        
        if (result.success && result.data) {
          const url = result.data.framer_component_link
          if (url) {
            await navigator.clipboard.writeText(url)
            showToast('success', 'Copied Successfully', 'Copied! Then paste in your Framer file')
          } else {
            const errMsg = 'Component link is not available yet'
            setError(errMsg)
            showToast('fail', 'Fail', errMsg)
          }
        } else {
          const errMsg = result.error?.message || 'Failed to fetch link'
          setError(errMsg)
          showToast('fail', 'Fail', errMsg)
        }
      } catch (err: any) {
        const errMsg = err?.message || 'Clipboard access denied'
        setError(errMsg)
        showToast('fail', 'Fail', errMsg)
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

        {/* Copy Component Button */}
        {hasFramerComponent && (
          <AuthAction message="Sign in to copy component" className="flex-1 sm:flex-none">
            <Button
              variant="secondary"
              size="default"
              borderRadius="full"
              className="gap-2 w-full sm:w-auto"
              disabled={isPending}
              onClick={handleCopyComponent}
            >
              <Copy size={16} />
              <span>Copy Component</span>
            </Button>
          </AuthAction>
        )}

        {/* Remix Button */}
        {hasRemix && (
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
        )}
      </div>
    </div>
  )
}
