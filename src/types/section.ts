export interface Section {
  id: string
  slug: string
  title: string
  body_text?: string
  category: string
  tags?: string[]
  preview_assets: {
    type: string
    thumb_url: string
    video_url: string
  }
  remix_link: string
  webflow_link?: string
  framer_component_link?: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface SectionCardData {
  id: string
  slug: string
  title: string
  description?: string
  thumbnailUrl: string
  videoUrl?: string
  index?: string
  category?: string
}
