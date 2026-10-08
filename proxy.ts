import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const acceptHeader = request.headers.get('accept') || '';
  
  if (acceptHeader.includes('text/markdown')) {
    const path = request.nextUrl.pathname;
    
    if (path === '/') {
      const markdown = `# FlowRadiantPro GST Invoicing Software\n\nFlowRadiantPro is the all-in-one Business OS for Indian SMBs. Start with smart GST invoicing, payment tracking, and client management to scale your business.\n\n## Developer Resources\n- [llms.txt](/llms.txt)\n- [API Docs](/docs/api)\n- [MCP Server](/.well-known/mcp)\n`;
      return new NextResponse(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Vary': 'Accept'
        }
      });
    }

    // For any other path requested with markdown, return a 404 markdown response.
    const notFoundMd = `# 404 Not Found\n\nThe path you requested does not exist on FlowRadiantPro.\n\nPlease refer to our [llms.txt](/llms.txt) for agent instructions or our [Sitemap](/sitemap.xml) for valid URLs.`;
    
    return new NextResponse(notFoundMd, {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown',
        'Vary': 'Accept'
      }
    });
  }

  // For normal requests, just add Vary: Accept
  const response = NextResponse.next();
  // Next.js might append its own Vary headers, so we append
  response.headers.set('Vary', 'Accept, Accept-Encoding');
  return response;
}

export const config = {
  // Apply to all routes except API, Next.js static assets, and images
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}


