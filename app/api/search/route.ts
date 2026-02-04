import { NextRequest, NextResponse } from "next/server"
import { filterMockResults } from "@/lib/mock-data"
import type { SearchRequest } from "@/lib/search-types"

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { query, options } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [], status: "empty" })
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Simulate different states randomly for demo purposes
    const random = Math.random()
    
    // 10% chance of indexing state
    if (random < 0.1) {
      return NextResponse.json({
        results: [],
        status: "indexing",
        indexingProgress: Math.floor(Math.random() * 80) + 10,
      })
    }
    
    // 5% chance of error state
    if (random < 0.15) {
      return NextResponse.json(
        { error: "Engine temporarily unavailable. Please try again.", status: "error" },
        { status: 503 }
      )
    }

    const results = filterMockResults(query, {
      includeDeleted: options.includeDeleted,
      includeRenamed: options.includeRenamed,
    })

    return NextResponse.json({
      results,
      status: results.length > 0 ? "success" : "empty",
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to process search request", status: "error" },
      { status: 500 }
    )
  }
}
