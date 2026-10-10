import { SectionList } from '@/components/gallery/SectionList'
import { HeroTitle } from '@/components/ui/HeroTitle'
import { getSections } from '@/actions/sections'

export const revalidate = 3600

export default async function Home() {
  const { success, data: sections, hasMore } = await getSections(6, 0)

  return (
    <div className="flex flex-col pt-0 sm:pt-0">
      {/* Animated Hero Header */}
      <HeroTitle />

      {/* Main Gallery List pre-rendered on Server */}

      {/* Main Gallery List pre-rendered on Server */}
      <SectionList 
        initialSections={success && sections ? sections : []} 
        initialHasMore={hasMore} 
      />
    </div>
  )
}
