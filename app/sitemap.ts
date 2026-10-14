import { MetadataRoute } from 'next'
import products from '../data/products.json'
import { journalPosts as blogPosts } from '../lib/site/journal'

const baseUrl = 'https://www.sheepiesleep.com'
const locales = ['en', 'id']
const blogLocale = 'id'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/blog',
    '/calmicloud-earplug-guide',
    '/contact',
    '/faq',
    '/products',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  sitemapEntries.push({
    url: `${baseUrl}/bio`,
    changeFrequency: 'weekly',
    priority: 0.9,
  })

  // Helper to generate alternate languages for a specific path
  // path should start with / (e.g. /about)
  const getAlternates = (path: string) => {
    const languages: Record<string, string> = {}
    locales.forEach((l) => {
      languages[l] = `${baseUrl}/${l}${path}`
    })
    languages['x-default'] = `${baseUrl}/id${path}`
    return { languages }
  }

  // Iterate over each locale to generate localized URLs
  for (const locale of locales) {
    // 1. Static Pages
    for (const route of routes) {
      // The blog is Indonesian-only; /en/blog is noindex, so it stays out of the sitemap.
      if (route === '/blog' && locale !== blogLocale) continue

      // The route itself (e.g., /about) is appended to the locale (e.g., /en)
      // For the home page (route === ''), it becomes /en
      const fullPath = route
      
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${fullPath}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
        alternates: route === '/blog'
          ? { languages: { id: `${baseUrl}/id/blog`, 'x-default': `${baseUrl}/id/blog` } }
          : getAlternates(fullPath)
      })
    }

    // 2. Product Pages
    for (const product of products) {
      const path = `/products/${product.slug}`
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: getAlternates(path)
      })
    }

    // Blog SEO is intentionally Indonesian-only for marketplace traffic.
    if (locale === blogLocale) {
      for (const post of blogPosts) {
        const path = `/blog/${post.slug}`
        sitemapEntries.push({
          url: `${baseUrl}/${blogLocale}${path}`,
          lastModified: new Date(post.updated ?? post.date),
          changeFrequency: 'weekly',
          priority: 0.75,
          alternates: {
            languages: {
              id: `${baseUrl}/${blogLocale}${path}`,
              'x-default': `${baseUrl}/${blogLocale}${path}`,
            },
          },
        })
      }
    }
  }

  return sitemapEntries
}
