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
    <div className="flex flex-col h-full bg-white p-[24px]">
      {/* 16:9 aspect ratio thumbnail container with solid accent orange (#E74E1B) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E74E1B] rounded-none" />

      {/* Title skeleton */}
      <div className="mt-[16px] flex flex-col">
        <div className="h-5 w-2/3 bg-[#000000]/10 rounded-none animate-pulse" />
      </div>
    </div>
  )
}
