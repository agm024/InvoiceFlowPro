import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 1. Dedicated handling for /sitemap.xml to guarantee 200 OK (never 304 Not Modified)
  if (path === '/sitemap.xml') {
    // Strip conditional request headers so Next.js/Vercel always generates a full 200 OK response
    const requestHeaders = new Headers(request.headers)
    requestHeaders.delete('if-none-match')
    requestHeaders.delete('if-modified-since')

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    // Force application/xml and fresh delivery to prevent downstream 304 caching
    response.headers.set('Content-Type', 'application/xml; charset=utf-8')
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    response.headers.delete('etag')
    return response
  }

  // 2. Dedicated handling for /robots.txt
  if (path === '/robots.txt') {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.delete('if-none-match')
    requestHeaders.delete('if-modified-since')

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    response.headers.set('Content-Type', 'text/plain; charset=utf-8')
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    response.headers.delete('etag')
    return response
  }

  // 3. Agent Markdown negotiation (acceptmarkdown.com standard)
  const acceptHeader = request.headers.get('accept') || ''
  
  if (acceptHeader.includes('text/markdown')) {
    // Allow direct XML/TXT assets to pass through cleanly
    if (path === '/sitemap.xml' || path === '/robots.txt' || path === '/llms.txt') {
      return NextResponse.next()
    }

    if (path === '/') {
      const markdown = `# FlowRadiantPro GST Invoicing Software\n\nFlowRadiantPro is the all-in-one Business OS for Indian SMBs. Start with smart GST invoicing, payment tracking, and client management to scale your business.\n\n## Developer Resources\n- [llms.txt](/llms.txt)\n- [API Docs](/docs/api)\n- [MCP Server](/.well-known/mcp)\n- [Sitemap](/sitemap.xml)\n`
      return new NextResponse(markdown, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Vary': 'Accept',
        },
      })
    }

    // For nonexistent or unhandled paths requested with text/markdown, return informative 404 Markdown
    const notFoundMd = `# 404 Not Found\n\nThe path you requested does not exist on FlowRadiantPro.\n\nPlease refer to our [llms.txt](/llms.txt) for agent instructions or our [Sitemap](/sitemap.xml) for valid URLs.`
    
    return new NextResponse(notFoundMd, {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept',
      },
    })
  }

  // 4. Default web response: add Vary: Accept, Accept-Encoding for content negotiation
  const response = NextResponse.next()
  response.headers.set('Vary', 'Accept, Accept-Encoding')
  return response
}

export const config = {
  // Apply to all routes except API, Next.js static assets, and images
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
