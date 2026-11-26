import { createHash, timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { COUNTRIES_TAG } from "@/lib/api/countries";
import { UNIVERSITIES_TAG } from "@/lib/api/universities";

// Called by the API after content changes, so the public pages update at once.
const ALLOWED_TAGS: string[] = [COUNTRIES_TAG, UNIVERSITIES_TAG];

// Compare digests so the check takes the same time whatever the input looks like
const digest = (value: string) => createHash("sha256").update(value).digest();

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = request.headers.get("x-revalidate-secret") ?? "";
  if (!secret || !timingSafeEqual(digest(given), digest(secret))) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags)
    ? body.tags.filter((tag): tag is string => typeof tag === "string" && ALLOWED_TAGS.includes(tag))
    : [];
  if (!tags.length) {
    return NextResponse.json({ success: false, message: "No valid tags" }, { status: 400 });
  }

  tags.forEach((tag) => revalidateTag(tag));
  return NextResponse.json({ success: true, revalidated: tags });
}
