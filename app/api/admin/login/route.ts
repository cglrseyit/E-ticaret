import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, setSessionCookie } from "@/lib/auth";
import { clientIp } from "@/lib/analytics/server";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

// Brute-force guard: max 8 attempts / 5 min per IP.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW = 5 * 60 * 1000;
const MAX = 8;

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW });
    return false;
  }
  rec.count++;
  return rec.count > MAX;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (tooManyAttempts(ip)) {
    return NextResponse.json(
      { error: "Çok fazla deneme. Lütfen birkaç dakika sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı" }, { status: 400 });
  }

  const session = await authenticate(parsed.data.email, parsed.data.password);
  if (!session) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı" }, { status: 401 });
  }

  await setSessionCookie(session);
  return NextResponse.json({ ok: true });
}
