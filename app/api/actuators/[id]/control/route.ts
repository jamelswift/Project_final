import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { withApiKey } from "@/lib/api/auth-middleware"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiKey(request, async () => {
    const { id } = await params
    const supabase = await getSupabaseServerClient()
    const body = await request.json()

    const { state, value } = body

    if (typeof state !== "boolean") {
      return NextResponse.json({ error: "State must be a boolean" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("actuators")
      .update({ state, value: value || 0, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Log the control action
    await supabase.from("actuator_logs").insert({
      actuator_id: id,
      state,
      value: value || 0,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ data, message: "Actuator controlled successfully" })
  })
}
