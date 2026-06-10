import { NextResponse } from "next/server";
import { getAdminSession, type AdminSession } from "@/lib/auth";

/** Returns the admin session, or a 401 response to return early. */
export async function requireAdmin(): Promise<
  { session: AdminSession } | { response: NextResponse }
> {
  const session = await getAdminSession();
  if (!session) {
    return { response: NextResponse.json({ error: "Yetkisiz" }, { status: 401 }) };
  }
  return { session };
}
