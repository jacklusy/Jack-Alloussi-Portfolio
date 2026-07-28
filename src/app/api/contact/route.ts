import { NextResponse } from 'next/server';
import { Resend } from 'resend';
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

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
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

  const { name, email, subject, message } = parsed.data;

  if (!env.RESEND_API_KEY) {
    if (env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error:
            'Contact form delivery is temporarily unavailable. Please email jackalloussi23@gmail.com directly.',
        },
        { status: 503 },
      );
    }

    console.info('[contact] Dev mode — email not sent', { name, email, subject, message });
    return NextResponse.json({ data: { ok: true } });
  }

  if (!env.CONTACT_TO_EMAIL) {
    return NextResponse.json(
      {
        error:
          'Contact form is misconfigured. Please email jackalloussi23@gmail.com directly.',
      },
      { status: 503 },
    );
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const safeSubject = subject.trim() || 'Portfolio contact';
  const html = `
    <h2>New portfolio message</h2>
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replaceAll('\n', '<br/>')}</p>
  `;

  try {
    const { error } = await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `[Portfolio] ${safeSubject}`,
      html,
      text: `From: ${name} <${email}>\nSubject: ${safeSubject}\n\n${message}`,
    });

    if (error) {
      console.error('[contact] Resend error', error);
      return NextResponse.json(
        { error: 'Could not send your message. Please email me directly.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    console.error('[contact] Unexpected send failure', error);
    return NextResponse.json(
      { error: 'Could not send your message. Please email me directly.' },
      { status: 502 },
    );
  }
}
