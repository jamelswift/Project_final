import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { withApiKey } from "@/lib/api/auth-middleware"

export async function GET(request: NextRequest) {
  return withApiKey(request, async () => {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)

    const type = searchParams.get("type")
    const status = searchParams.get("status")

    let query = supabase.from("actuators").select("*")

    if (type) query = query.eq("type", type)
    if (status) query = query.eq("status", status)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, count: data.length })
  })
}
