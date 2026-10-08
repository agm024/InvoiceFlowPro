import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    mcpVersion: "1.0",
    server: {
      name: "FlowRadiantPro MCP Server",
      version: "1.0.0"
    },
    capabilities: {
      tools: {}
    },
    transport: "http"
  })
}
