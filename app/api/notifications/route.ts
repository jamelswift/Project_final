import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { withApiKey } from "@/lib/api/auth-middleware"

export async function GET(request: NextRequest) {
  return withApiKey(request, async () => {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)

    const isRead = searchParams.get("is_read")
    const severity = searchParams.get("severity")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(limit)

    if (isRead !== null) query = query.eq("is_read", isRead === "true")
    if (severity) query = query.eq("severity", severity)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, count: data.length })
  })
}
