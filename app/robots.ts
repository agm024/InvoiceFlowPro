import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/pay/'],
      },
      {
        userAgent: ['GPTBot', 'CCBot', 'ClaudeBot', 'Applebot-Extended', 'Google-Extended', 'PerplexityBot', 'Omgilibot', 'Omgili', 'FacebookBot'],
        disallow: '/',
      }
    ],
    sitemap: 'https://flow.siteradiant.co.in/sitemap.xml',
  }
}

