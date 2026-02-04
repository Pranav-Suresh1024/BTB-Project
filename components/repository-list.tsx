"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { fetchUserRepositories, type GitHubRepo } from "@/lib/github"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, Star, History } from "lucide-react"

export function RepositoryList() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRepos() {
      setLoading(true)
      const result = await fetchUserRepositories()
      setRepos(result.repos)
      setError(result.error)
      setLoading(false)
    }
    loadRepos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading repositories...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">No public repositories found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {repos.length} public {repos.length === 1 ? "repository" : "repositories"} - Select one to search its history
      </p>
      <div className="grid gap-3">
        {repos.map((repo) => {
          const [owner] = repo.full_name.split("/")
          return (
            <Card key={repo.id} className="transition-colors hover:bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold text-primary">
                      {repo.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      Public
                    </Badge>
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                {repo.description && (
                  <CardDescription className="line-clamp-2 text-sm">
                    {repo.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {repo.stargazers_count}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/repo/${owner}/${repo.name}`} className="gap-2">
                      <History className="h-3 w-3" />
                      Search History
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
