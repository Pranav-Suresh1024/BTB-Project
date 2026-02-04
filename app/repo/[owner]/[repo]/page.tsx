"use client"

import { useState } from "react"
import Link from "next/link"
import { use } from "react"
import { ArrowLeft, Github, History, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SearchBar } from "@/components/search/search-bar"
import { SearchOptionsPanel } from "@/components/search/search-options"
import { SearchResults } from "@/components/search/search-results"
import { SearchStateDisplay } from "@/components/search/search-state"
import type { SearchOptions, SearchState, SearchResult } from "@/lib/search-types"

interface PageProps {
  params: Promise<{
    owner: string
    repo: string
  }>
}

export default function RepositoryPage({ params }: PageProps) {
  const { owner, repo } = use(params)
  
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<SearchOptions>({
    includeDeleted: true,
    includeRenamed: true,
  })
  const [searchState, setSearchState] = useState<SearchState>({
    status: "idle",
    results: [],
  })

  const handleSearch = async () => {
    if (!query.trim()) return

    setSearchState({ status: "loading", results: [] })

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: `${owner}/${repo}`,
          query: query.trim(),
          options,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setSearchState({
          status: "error",
          results: [],
          error: data.error || "Search failed",
        })
        return
      }

      if (data.status === "indexing") {
        setSearchState({
          status: "indexing",
          results: [],
          indexingProgress: data.indexingProgress,
        })
        return
      }

      setSearchState({
        status: data.results.length > 0 ? "success" : "empty",
        results: data.results as SearchResult[],
      })
    } catch {
      setSearchState({
        status: "error",
        results: [],
        error: "Failed to connect to search engine",
      })
    }
  }

  const repoUrl = `https://github.com/${owner}/${repo}`

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold text-foreground">{owner}</span>
                <span className="text-muted-foreground">/</span>
                <span className="font-semibold text-foreground">{repo}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-8">
          {/* Intro Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <History className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Repository History Search
                </h1>
                <p className="text-muted-foreground">
                  Search across the entire Git history of{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
                    {owner}/{repo}
                  </code>
                </p>
              </div>
            </div>

            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="flex items-start gap-3 p-4">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                <p className="text-sm text-muted-foreground">
                  Search for files and directories that existed at any point in this
                  repository's history, including deleted or renamed paths. Results show
                  the commit history for each matching file.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search Section */}
          <div className="space-y-4">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
              disabled={searchState.status === "loading"}
            />
            <SearchOptionsPanel options={options} onChange={setOptions} />
          </div>

          {/* Results Section */}
          <div className="min-h-[300px]">
            {searchState.status === "success" && searchState.results.length > 0 ? (
              <SearchResults results={searchState.results} owner={owner} repo={repo} />
            ) : (
              <SearchStateDisplay
                status={searchState.status}
                error={searchState.error}
                indexingProgress={searchState.indexingProgress}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
