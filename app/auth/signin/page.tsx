"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github } from "lucide-react"

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full gap-2"
            size="lg"
          >
            <Github className="h-5 w-5" />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
