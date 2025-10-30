import { NextResponse } from "next/server";
// import { updateSession } from "./lib/supabase/middleware";

export async function middleware(request: Request) {
  // ถ้าใช้ Supabase Auth:
  // return await updateSession(request)

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
