import { SectionList } from '@/components/gallery/SectionList'
import { getSections } from '@/actions/sections'

export const revalidate = 3600

export default async function Home() {
  const { success, data: sections, hasMore } = await getSections(6, 0)

  return (
    <div className="flex flex-col pt-0 sm:pt-0">
      {/* Hero Header */}
      <section className="flex flex-col items-center text-center mt-[48px] mb-[100px] gap-3 w-full sm:w-[400px] mx-auto">
        <h1 className="font-sans font-bold text-[24px] text-[#121212] tracking-[-0.04em] leading-[1.2]">
          Best GSAP Library <br />
          Copy. Paste. Done
        </h1>
        <p className="font-sans font-normal text-[20px] text-black/75 tracking-[-0.04em] leading-[1.2]">
          Drop into Framer or paste straight into Cursor, Claude, Gemini, or Bolt.
        </p>
      </section>

      {/* Main Gallery List pre-rendered on Server */}
      <SectionList 
        initialSections={success && sections ? sections : []} 
        initialHasMore={hasMore} 
      />
    </div>
  )
}
