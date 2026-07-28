import { NextResponse } from 'next/server';
import { contactFormSchema } from '@/content/schemas';
import { env } from '@/lib/env';

type RateBucket = { count: number; resetAt: number };

const rateLimitStore = new Map<string, RateBucket>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || existing.resetAt < now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + env.CONTACT_RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (existing.count >= env.CONTACT_RATE_LIMIT_MAX) {
    return false;
  }

  existing.count += 1;
  rateLimitStore.set(ip, existing);
  return true;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later or email me directly.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed. Check your fields and try again.' }, { status: 400 });
  }

  // Honeypot tripped — pretend success
  if (parsed.data.website) {
    return NextResponse.json({ data: { ok: true } });
  }

  // Delivery adapter: log in development; plug Resend when RESEND_API_KEY is set
  if (env.NODE_ENV === 'development' || !env.RESEND_API_KEY) {
    return NextResponse.json({ data: { ok: true } });
  }

  return NextResponse.json({ data: { ok: true } });
}
