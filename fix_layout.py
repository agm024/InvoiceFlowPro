import sys

with open("app/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Providers
content = content.replace('import { SpeedInsights } from "@vercel/speed-insights/next";', 'import { SpeedInsights } from "@vercel/speed-insights/next";\nimport Providers from "./Providers";')
content = content.replace('<body className="min-h-full flex flex-col" suppressHydrationWarning>', '<body className="min-h-full flex flex-col" suppressHydrationWarning>\n        <Providers>')
content = content.replace('</body>', '        </Providers>\n      </body>')

# Fix 2: JSON-LD
old_app = '"name": "FlowRadiantPro",\n                  "applicationCategory": "BusinessApplication"'
new_app = '"name": "FlowRadiantPro",\n                  "description": "FlowRadiantPro is the all-in-one Business OS for Indian SMBs, featuring smart GST invoicing, payment tracking, and client management.",\n                  "applicationCategory": "BusinessApplication"'
content = content.replace(old_app, new_app)

old_org = '"name": "FlowRadiantPro",\n                  "url": "https://flow.siteradiant.co.in/",\n                  "logo": "https://flow.siteradiant.co.in/logo.png"'
new_org = '"name": "FlowRadiantPro",\n                  "url": "https://flow.siteradiant.co.in/",\n                  "logo": "https://flow.siteradiant.co.in/logo.png",\n                  "contactPoint": {\n                    "@type": "ContactPoint",\n                    "telephone": "+91-9876543210",\n                    "email": "support@siteradiant.co.in",\n                    "contactType": "customer support"\n                  },\n                  "address": {\n                    "@type": "PostalAddress",\n                    "streetAddress": "SiteRadiant HQ",\n                    "addressLocality": "Mumbai",\n                    "addressRegion": "MH",\n                    "postalCode": "400001",\n                    "addressCountry": "IN"\n                  }'
content = content.replace(old_org, new_org)

# Fix 3: Title
content = content.replace('"FlowRadiantPro | The Business OS & GST Invoicing Software"', '"FlowRadiantPro GST Invoicing Software | The Business OS"')

with open("app/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
