import { NextRequest } from "next/server"
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const authHandler = NextAuth(authOptions)

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const resolvedParams = await context.params
  
  // Clone the request with properly formatted URL to ensure searchParams work
  const url = new URL(request.url)
  const newRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
  })
  
  // Attach the resolved params in the format NextAuth expects
  Object.defineProperty(newRequest, "nextUrl", {
    value: url,
    writable: false,
  })
  
  return authHandler(newRequest as unknown as NextRequest, {
    params: { nextauth: resolvedParams.nextauth },
  })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const resolvedParams = await context.params
  
  const url = new URL(request.url)
  const body = await request.text()
  
  const newRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: body || undefined,
  })
  
  Object.defineProperty(newRequest, "nextUrl", {
    value: url,
    writable: false,
  })
  
  return authHandler(newRequest as unknown as NextRequest, {
    params: { nextauth: resolvedParams.nextauth },
  })
}
