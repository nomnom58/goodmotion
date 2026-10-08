import { Suspense } from 'react'
import { SectionList } from '@/components/gallery/SectionList'
import { SectionSkeleton } from '@/components/ui/Skeleton'
import { getSections } from '@/actions/sections'

export const revalidate = 3600

async function SectionGrid() {
  const { success, data: sections, hasMore, error } = await getSections(6, 0)

  if (!success || !sections || sections.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <p className="text-secondary-text font-mono">
          {error?.message || 'No sections found. Check back later!'}
        </p>
      </div>
    )
  }

  return (
    <SectionList 
      initialSections={sections} 
      initialHasMore={hasMore} 
    />
  )
}

function GridSkeleton() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 pb-20">
      {[...Array(4)].map((_, i) => (
        <SectionSkeleton key={i} />
      ))}
    </section>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col pt-0 sm:pt-0">
      {/* Hero Header */}
      <section className="flex flex-col gap-4 mb-6">
        <h1 className="font-sans font-bold text-[32px] sm:text-[40px] text-[#121212] tracking-[-0.04em] leading-[1.2] sm:max-w-[500px] text-left">
          Best GSAP library, Ready for Framer
        </h1>
        <p className="font-sans font-normal text-[14px] sm:text-[16px] text-secondary-text tracking-[-0.04em] leading-[1.2] sm:max-w-[480px]">
          Drop into Framer or paste straight into Cursor, Claude, Gemini, or Bolt. Ready in seconds.
        </p>
      </section>

      {/* Main Grid with Suspense */}
      <Suspense fallback={<GridSkeleton />}>
        <SectionGrid />
      </Suspense>
    </div>
  )
}
