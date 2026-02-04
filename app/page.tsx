import { AuthButtons } from "@/components/auth-buttons"
import { Github } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Github className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            GitHub Repository Explorer
          </h1>
          <p className="text-muted-foreground">
            Sign in with your GitHub account to view your repositories
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <AuthButtons />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          This app uses NextAuth.js for authentication
        </p>
      </div>
    </main>
  )
}
