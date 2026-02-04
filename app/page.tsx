import { AuthButtons } from "@/components/auth-buttons"
import { History } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <History className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Git History Search
          </h1>
          <p className="text-muted-foreground">
            Search for files and directories across your repository's entire Git history,
            including deleted and renamed paths
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <AuthButtons />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Sign in with GitHub to select a repository and start searching
        </p>
      </div>
    </main>
  )
}
