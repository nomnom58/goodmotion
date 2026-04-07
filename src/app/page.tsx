import { SectionCard } from '@/components/gallery/SectionCard'

// Mock data for initial UI dev
const MOCK_SECTIONS = [
  {
    id: '1',
    slug: 'image-split-scroll',
    title: 'Image Split Scroll Animation in Framer',
    description: 'A smooth scroll-triggered image split effect with GSAP integration.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    index: '01'
  },
  {
    id: '2',
    slug: 'hero-parallax',
    title: 'Dynamic Hero Parallax Section',
    description: 'High-performance parallax effect for modern landing pages.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    index: '02'
  },
  {
    id: '3',
    slug: 'sticky-reveal',
    title: 'Sticky Reveal Gallery Component',
    description: 'Perfect for showcasing multiple layers of content on scroll.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    index: '03'
  },
  {
    id: '4',
    slug: 'bento-grid-motion',
    title: 'Animated Bento Grid Layout',
    description: 'Flexible grid with staggered entrance animations and hover effects.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    index: '04'
  }
]

export default function Home() {
  return (
    <div className="flex flex-col pt-0 sm:pt-0">
      {/* Hero Header */}
      <section className="flex flex-col gap-4 mb-6">
        <h1 className="font-serif text-brand text-[32px] sm:text-[40px] leading-[32px] sm:leading-[40px] sm:w-[350px] text-left">
          Gap Library for Framer/Web
        </h1>
        <p className="font-mono text-[14px] sm:text-[16px] font-normal text-secondary-text sm:max-w-[450px]">
          A growing collection of high-end components, for Framer/Web
        </p>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-6 pb-20">
        {MOCK_SECTIONS.map((section) => (
          <SectionCard
            key={section.id}
            {...section}
          />
        ))}
      </section>
    </div>
  )
}
