import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/app/',
          '/pay/',
          '/api/',
          '/_next/',
        ],
      },
      {
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Applebot-Extended',
          'Google-Extended',
          'CCBot',
        ],
        allow: '/',
        disallow: [
          '/app/',
          '/pay/',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://flow.siteradiant.co.in/sitemap.xml',
    host: 'https://flow.siteradiant.co.in',
  }
}
