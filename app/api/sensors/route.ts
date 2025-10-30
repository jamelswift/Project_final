import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { withApiKey } from "@/lib/api/auth-middleware"

export async function GET(request: NextRequest) {
  return withApiKey(request, async () => {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)

    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const protocol = searchParams.get("protocol")

    let query = supabase.from("sensors").select("*")

    if (type) query = query.eq("type", type)
    if (status) query = query.eq("status", status)
    if (protocol) query = query.eq("protocol", protocol)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, count: data.length })
  })
}

export async function POST(request: NextRequest) {
  return withApiKey(request, async () => {
    const supabase = await getSupabaseServerClient()
    const body = await request.json()

    const { data, error } = await supabase.from("sensors").insert(body).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 201 })
  })
}
