import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { trackSchema } from "@/lib/validation";
import { rateLimit, isBot, parseDevice, clientIp } from "@/lib/analytics/server";

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent");

  // Bot filtering
  if (isBot(ua)) return NextResponse.json({ ok: true, skipped: "bot" });

  // Rate limit per IP
  if (!rateLimit(clientIp(req))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const cookieStore = await cookies();
  const sid = cookieStore.get("sid")?.value;
  if (!sid) return NextResponse.json({ ok: true, skipped: "no_session" });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const { type, path, metadata, ctx } = parsed.data;

  // Ensure the session exists, then record the event. upsert avoids the race
  // where several first-load beacons try to create the same session at once.
  try {
    await prisma.visitorSession.upsert({
      where: { id: sid },
      create: {
        id: sid,
        userAgent: ua ?? null,
        referrer: ctx?.referrer ?? req.headers.get("referer") ?? null,
        utmSource: ctx?.utmSource ?? null,
        utmMedium: ctx?.utmMedium ?? null,
        utmCampaign: ctx?.utmCampaign ?? null,
        device: parseDevice(ua),
        country: "TR",
        isReturning: false,
      },
      update: { lastSeen: new Date() },
    });

    await prisma.analyticsEvent.create({
      data: {
        sessionId: sid,
        type,
        path: path ?? null,
        metadata: (metadata ?? undefined) as object | undefined,
      },
    });
  } catch {
    // Swallow transient write conflicts; analytics is best-effort.
    return NextResponse.json({ ok: true, retry: true });
  }

  return NextResponse.json({ ok: true });
}
