"use client"

import { Search, AlertCircle, Loader2, Database } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { SearchStatus } from "@/lib/search-types"

interface SearchStateDisplayProps {
  status: SearchStatus
  error?: string
  indexingProgress?: number
}

export function SearchStateDisplay({ status, error, indexingProgress }: SearchStateDisplayProps) {
  if (status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-foreground">Start your search</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Enter a file or directory name to search across the entire repository history,
          including deleted and renamed paths.
        </p>
      </div>
    )
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
        <h3 className="mb-2 text-lg font-medium text-foreground">Searching...</h3>
        <p className="text-sm text-muted-foreground">
          Scanning repository history for matching files
        </p>
      </div>
    )
  }

  if (status === "empty") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-foreground">No results found</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try adjusting your search query or enabling additional filters like
          deleted or renamed files.
        </p>
      </div>
    )
  }

  if (status === "indexing") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Database className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-foreground">Indexing in progress</h3>
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">
          The repository is being indexed. This may take a few minutes for large repositories.
        </p>
        {indexingProgress !== undefined && (
          <div className="w-full max-w-xs space-y-2">
            <Progress value={indexingProgress} />
            <p className="text-xs text-muted-foreground">{indexingProgress}% complete</p>
          </div>
        )}
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-foreground">Search unavailable</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {error || "The search engine is temporarily unavailable. Please try again later."}
        </p>
      </div>
    )
  }

  return null
}
