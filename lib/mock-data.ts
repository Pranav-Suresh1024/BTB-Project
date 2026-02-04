import type { SearchResult } from "./search-types"

export const mockSearchResults: SearchResult[] = [
  {
    path: "src/auth/login.ts",
    commitSha: "abc1234",
    commitMessage: "Add login validation and error handling",
    commitDate: "2024-09-12",
    changeType: "deleted",
  },
  {
    path: "src/auth/login.ts",
    commitSha: "def5678",
    commitMessage: "Initial auth implementation",
    commitDate: "2024-08-15",
    changeType: "added",
  },
  {
    path: "src/components/auth-form.tsx",
    commitSha: "ghi9012",
    commitMessage: "Refactor auth form to use new design system",
    commitDate: "2024-10-01",
    changeType: "modified",
  },
  {
    path: "src/utils/auth-helpers.ts",
    commitSha: "jkl3456",
    commitMessage: "Rename auth utilities for clarity",
    commitDate: "2024-09-28",
    changeType: "renamed",
  },
  {
    path: "src/utils/auth-helpers.ts",
    commitSha: "mno7890",
    commitMessage: "Add helper functions for token validation",
    commitDate: "2024-09-20",
    changeType: "added",
  },
  {
    path: "lib/auth/session.ts",
    commitSha: "pqr1234",
    commitMessage: "Implement session management",
    commitDate: "2024-11-05",
    changeType: "added",
  },
  {
    path: "lib/auth/session.ts",
    commitSha: "stu5678",
    commitMessage: "Fix session expiry bug",
    commitDate: "2024-11-10",
    changeType: "modified",
  },
  {
    path: "config/auth.config.ts",
    commitSha: "vwx9012",
    commitMessage: "Remove deprecated auth config",
    commitDate: "2024-10-15",
    changeType: "deleted",
  },
]

export function filterMockResults(
  query: string,
  options: { includeDeleted: boolean; includeRenamed: boolean }
): SearchResult[] {
  const lowerQuery = query.toLowerCase()
  
  return mockSearchResults.filter((result) => {
    // Filter by query
    const matchesQuery = result.path.toLowerCase().includes(lowerQuery) ||
      result.commitMessage.toLowerCase().includes(lowerQuery)
    
    if (!matchesQuery) return false
    
    // Filter by options
    if (!options.includeDeleted && result.changeType === "deleted") return false
    if (!options.includeRenamed && result.changeType === "renamed") return false
    
    return true
  })
}

export function groupResultsByPath(results: SearchResult[]): Map<string, SearchResult[]> {
  const grouped = new Map<string, SearchResult[]>()
  
  for (const result of results) {
    const existing = grouped.get(result.path) || []
    grouped.set(result.path, [...existing, result])
  }
  
  // Sort results within each group by date (newest first)
  for (const [path, pathResults] of grouped) {
    grouped.set(
      path,
      pathResults.sort((a, b) => new Date(b.commitDate).getTime() - new Date(a.commitDate).getTime())
    )
  }
  
  return grouped
}
