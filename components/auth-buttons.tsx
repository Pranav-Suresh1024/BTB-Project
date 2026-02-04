"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Github, LogOut, Loader2 } from "lucide-react"
import { RepositoryList } from "./repository-list"

export function AuthButtons() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <img
                src={session.user.image || "/placeholder.svg"}
                alt={session.user.name || "User avatar"}
                className="h-12 w-12 rounded-full border-2 border-border"
              />
            )}
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="text-lg font-semibold text-foreground">
                {session.user?.name || session.user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut()}
            className="gap-2"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
        
        <div className="border-t border-border pt-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Your Repositories</h2>
          <RepositoryList />
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={() => signIn("github")}
      className="gap-2"
      size="lg"
    >
      <Github className="h-5 w-5" />
      Login with GitHub
    </Button>
  )
}
