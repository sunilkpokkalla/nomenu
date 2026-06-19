import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.nomenu.com'
  
  // Create an anon client to fetch public routes
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    // Fetch all active restaurants
    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('id, slug, updated_at')

    if (restaurants) {
      for (const restaurant of restaurants) {
        if (!restaurant.slug) continue;
        
        sitemapEntries.push({
          url: `${baseUrl}/${restaurant.slug}`,
          lastModified: new Date(restaurant.updated_at || new Date()),
          changeFrequency: 'daily',
          priority: 0.8,
        })

        // Fetch all active menus for this restaurant
        const { data: menus } = await supabase
          .from('menus')
          .select('slug, updated_at')
          .eq('restaurant_id', restaurant.id)
          .eq('is_active', true)
        
        if (menus) {
          for (const menu of menus) {
            if (!menu.slug) continue;
            sitemapEntries.push({
              url: `${baseUrl}/${restaurant.slug}/${menu.slug}`,
              lastModified: new Date(menu.updated_at || new Date()),
              changeFrequency: 'daily',
              priority: 0.9,
            })
          }
        }
      }
    }
  } catch (err) {
    console.error('Error generating sitemap dynamic URLs:', err)
  }

  return sitemapEntries
}
