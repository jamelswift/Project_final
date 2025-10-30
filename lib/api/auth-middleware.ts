import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, userId: string) => Promise<NextResponse>,
) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return handler(request, user.id)
}

export async function withApiKey(request: NextRequest, handler: (request: NextRequest) => Promise<NextResponse>) {
  const apiKey = request.headers.get("X-API-Key")

  if (!apiKey) {
    return NextResponse.json({ error: "API key required" }, { status: 401 })
  }

  const supabase = await getSupabaseServerClient()
  const { data: keyData } = await supabase.from("api_keys").select("*").eq("key_hash", apiKey).single()

  if (!keyData) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
  }

  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
    return NextResponse.json({ error: "API key expired" }, { status: 401 })
  }

  // Update last used timestamp
  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id)

  return handler(request)
}

export async function verifyApiKey(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key")

  if (!apiKey) {
    return { authorized: false, error: "API key required" }
  }

  const supabase = await getSupabaseServerClient()
  const { data: keyData } = await supabase.from("api_keys").select("*").eq("key_hash", apiKey).single()

  if (!keyData) {
    return { authorized: false, error: "Invalid API key" }
  }

  if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
    return { authorized: false, error: "API key expired" }
  }

  // Update last used timestamp
  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id)

  return {
    authorized: true,
    permissions: keyData.permissions || { read: true, write: false },
    userId: keyData.user_id,
  }
}
