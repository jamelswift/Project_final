import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { withApiKey } from "@/lib/api/auth-middleware"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiKey(request, async () => {
    const { id } = await params
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase.from("sensors").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: "Sensor not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiKey(request, async () => {
    const { id } = await params
    const supabase = await getSupabaseServerClient()
    const body = await request.json()

    const { data, error } = await supabase.from("sensors").update(body).eq("id", id).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiKey(request, async () => {
    const { id } = await params
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.from("sensors").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Sensor deleted successfully" })
  })
}
