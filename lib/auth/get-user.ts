import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { User } from "@/types/database"

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return null

  const { data: user } = await supabase.from("users").select("*").eq("id", authUser.id).single()

  return user
}
