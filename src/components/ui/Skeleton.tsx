import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-tag-bg/50',
        className
      )}
    />
  )
}

export function SectionSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* 16:9 aspect ratio skeleton */}
      <div className="relative aspect-16-9 w-full overflow-hidden bg-tag-bg/30 rounded-sm">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="flex flex-col gap-2">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4 rounded-sm" />
      </div>
    </div>
  )
}
