'use server'

import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { Section, SectionCardData } from '@/types/section'

export async function getSections(limit: number = 6, offset: number = 0): Promise<{ success: boolean; data?: SectionCardData[]; error?: any; hasMore: boolean }> {
  try {
    const { data, error, count } = await supabase
      .from('sections')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching sections:', error)
      return { 
        success: false, 
        error: { code: 'SYS_500', message: 'Failed to fetch sections from database' },
        hasMore: false
      }
    }

    const hasMore = count ? (offset + limit < count) : false

    const sections = (data as Section[]).map((row, idx) => {
      const assets = row.preview_assets || []
      const imageAsset = assets.find(a => a.type === 'image')
      const videoAsset = assets.find(a => a.type === 'video')

      // Use absolute index for display
      const displayIndex = (offset + idx + 1).toString().padStart(2, '0')

      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.body_text,
        thumbnailUrl: imageAsset?.url || '', // Only use image asset for thumbnail
        videoUrl: videoAsset?.url,
        index: displayIndex,
        category: row.category
      }
    })

    return {
      success: true,
      data: sections,
      hasMore,
      message: 'Sections fetched successfully'
    } as any
  } catch (err) {
    console.error('Unexpected error:', err)
    return { 
      success: false, 
      error: { code: 'SYS_500', message: 'An unexpected error occurred' },
      hasMore: false
    }
  }
}

export async function getSectionDetail(slug: string): Promise<{ 
  success: boolean; 
  data?: { section: Section; related: SectionCardData[] }; 
  error?: any 
}> {
  try {
    // 1. Fetch the main section
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (sectionError || !section) {
      console.error('Error fetching section detail:', sectionError)
      return { 
        success: false, 
        error: { code: 'SEC_404', message: 'Section not found' } 
      }
    }

    // 2. Fetch related sections (latest 3 in same category, excluding current)
    const { data: relatedData, error: relatedError } = await supabase
      .from('sections')
      .select('*')
      .eq('category', section.category)
      .eq('is_active', true)
      .neq('id', section.id)
      .order('created_at', { ascending: false })
      .limit(3)

    const related = (relatedData || []).map((row: any, idx: number) => {
      const assets = row.preview_assets || []
      const imageAsset = assets.find((a: any) => a.type === 'image')
      const videoAsset = assets.find((a: any) => a.type === 'video')
      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        thumbnailUrl: imageAsset?.url || '',
        index: (idx + 1).toString().padStart(2, '0')
      }
    })

    return {
      success: true,
      data: {
        section: section as Section,
        related
      }
    }
  } catch (err) {
    console.error('Unexpected error in getSectionDetail:', err)
    return { success: false, error: { code: 'SYS_500', message: 'Server error' } }
  }
}

export async function getProtectedLinks(sectionId: string): Promise<{ 
  success: boolean; 
  data?: { remix_link: string; webflow_link?: string }; 
  error?: any 
}> {
  try {
    // Verify session via Clerk
    const { userId } = await auth()
    
    if (!userId) {
      return { 
        success: false, 
        error: { code: 'AUTH_001', message: 'Authentication required' } 
      }
    }

    const { data, error } = await supabase
      .from('sections')
      .select('remix_link, webflow_link')
      .eq('id', sectionId)
      .single()

    if (error || !data) {
      return { 
        success: false, 
        error: { code: 'SEC_404', message: 'Links not found' } 
      }
    }

    return {
      success: true,
      data: {
        remix_link: data.remix_link,
        webflow_link: data.webflow_link
      }
    }
  } catch (err) {
    console.error('Error in getProtectedLinks:', err)
    return { success: false, error: { code: 'SYS_500', message: 'Internal server error' } }
  }
}
