export type ChangeType = "added" | "modified" | "deleted" | "renamed"

export interface SearchResult {
  path: string
  commitSha: string
  commitMessage: string
  commitDate: string
  changeType: ChangeType
}

export interface SearchOptions {
  includeDeleted: boolean
  includeRenamed: boolean
  limitCommits?: number
}

export interface SearchRequest {
  repo: string
  query: string
  options: SearchOptions
}

export type SearchStatus = "idle" | "loading" | "success" | "empty" | "indexing" | "error"

export interface SearchState {
  status: SearchStatus
  results: SearchResult[]
  error?: string
  indexingProgress?: number
}
