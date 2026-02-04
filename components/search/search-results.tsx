"use client"

import { FileText, GitCommit, ExternalLink, Clock, Trash2, Plus, Edit, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SearchResult, ChangeType } from "@/lib/search-types"
import { groupResultsByPath } from "@/lib/mock-data"

interface SearchResultsProps {
  results: SearchResult[]
  owner: string
  repo: string
}

function getChangeTypeConfig(type: ChangeType) {
  switch (type) {
    case "added":
      return { icon: Plus, label: "Added", variant: "default" as const, className: "bg-green-500/10 text-green-600 border-green-500/20" }
    case "deleted":
      return { icon: Trash2, label: "Deleted", variant: "destructive" as const, className: "bg-red-500/10 text-red-600 border-red-500/20" }
    case "modified":
      return { icon: Edit, label: "Modified", variant: "secondary" as const, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" }
    case "renamed":
      return { icon: ArrowRight, label: "Renamed", variant: "outline" as const, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" }
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function shortenSha(sha: string) {
  return sha.slice(0, 7)
}

export function SearchResults({ results, owner, repo }: SearchResultsProps) {
  const groupedResults = groupResultsByPath(results)
  const repoUrl = `https://github.com/${owner}/${repo}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "result" : "results"} found across{" "}
          {groupedResults.size} {groupedResults.size === 1 ? "file" : "files"}
        </p>
        <Button variant="outline" size="sm" asChild>
          <a href={`${repoUrl}/commits`} target="_blank" rel="noopener noreferrer" className="gap-2">
            View repository history
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>

      <div className="space-y-4">
        {Array.from(groupedResults.entries()).map(([path, pathResults]) => (
          <Card key={path}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
                  {path}
                </code>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pathResults.map((result, idx) => {
                const config = getChangeTypeConfig(result.changeType)
                const Icon = config.icon
                const commitUrl = `${repoUrl}/commit/${result.commitSha}`

                return (
                  <div
                    key={`${result.commitSha}-${idx}`}
                    className="flex items-start justify-between gap-4 rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={config.className}>
                          <Icon className="mr-1 h-3 w-3" />
                          {config.label}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(result.commitDate)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{result.commitMessage}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <GitCommit className="h-3 w-3" />
                        <code className="font-mono">{shortenSha(result.commitSha)}</code>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                      <a href={commitUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View commit on GitHub</span>
                      </a>
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
