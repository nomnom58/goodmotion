import { Suspense } from 'react'
import { SectionCard } from '@/components/gallery/SectionCard'
import { SectionSkeleton } from '@/components/ui/Skeleton'
import { getSections } from '@/actions/sections'

async function SectionGrid() {
  const { success, data: sections, error } = await getSections()

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
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-6 pb-20">
      {sections.map((section) => (
        <SectionCard
          key={section.id}
          {...section}
        />
      ))}
    </section>
  )
}

function GridSkeleton() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-6 pb-20">
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
        <h1 className="font-serif text-brand text-[40px] leading-[40px] sm:w-[350px] text-left">
          Gap Library for Framer/Web
        </h1>
        <p className="font-mono text-[14px] sm:text-[16px] font-normal text-secondary-text sm:max-w-[450px]">
          Static designs are no longer enough. GOOD MOTION bridges the gap between high-end design and complex web animation.
        </p>
      </section>

      {/* Main Grid with Suspense */}
      <Suspense fallback={<GridSkeleton />}>
        <SectionGrid />
      </Suspense>
    </div>
  )
}
