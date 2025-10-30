// import { createBrowserClient } from "@supabase/ssr";

// let client: ReturnType<typeof createBrowserClient> | null = null;

// export function getSupabaseBrowserClient() {
//   // ถ้ามี client เดิมแล้ว ใช้อันเดิม
//   if (client) return client;

//   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

//   // ✅ ตรวจว่ามีค่าจริงก่อนสร้าง client
//   if (!url || !key) {
//     console.warn("⚠️ Supabase client not initialized — missing env vars");
//     // คืน mock client ชั่วคราว เพื่อไม่ให้ build พัง
//     return {
//       auth: {
//         signInWithPassword: async () => ({ data: null, error: null }),
//         signUp: async () => ({ data: null, error: null }),
//         signOut: async () => ({ error: null }),
//         getSession: async () => ({ data: null, error: null }),
//       },
//       from: () => ({
//         select: async () => ({ data: [], error: null }),
//         insert: async () => ({ data: [], error: null }),
//         update: async () => ({ data: [], error: null }),
//         delete: async () => ({ data: [], error: null }),
//       }),
//     };
//   }

//   // ✅ ถ้ามีค่า env ครบ → สร้าง client จริง
//   client = createBrowserClient(url, key);
//   return client;
// }
