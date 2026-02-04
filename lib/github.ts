"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { getToken } from "next-auth/jwt"
import { cookies } from "next/headers"

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  private: boolean
  html_url: string
  stargazers_count: number
  language: string | null
  updated_at: string
}

export async function fetchUserRepositories(): Promise<{
  repos: GitHubRepo[]
  error: string | null
}> {
  try {
    // Get the JWT token which contains the access token
    const cookieStore = await cookies()
    const token = await getToken({
      req: {
        cookies: cookieStore,
        headers: new Headers(),
      } as any,
      secret: process.env.AUTH_SECRET!,
    })

    if (!token?.accessToken) {
      return { repos: [], error: "Not authenticated or missing access token" }
    }

    const response = await fetch("https://api.github.com/user/repos?type=owner&sort=updated&per_page=100", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { repos: [], error: errorData.message || `GitHub API error: ${response.status}` }
    }

    const repos: GitHubRepo[] = await response.json()
    
    // Filter to only public repos as per requirements
    const publicRepos = repos.filter((repo) => !repo.private)

    return { repos: publicRepos, error: null }
  } catch (error) {
    console.error("Error fetching repositories:", error)
    return { repos: [], error: "Failed to fetch repositories" }
  }
}
