import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  CONTACT_FROM_EMAIL: z
    .string()
    .default('Jack Alloussi Portfolio <onboarding@resend.dev>'),
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  CONTACT_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(600_000),
  RESEND_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL || undefined,
    CONTACT_RATE_LIMIT_MAX: process.env.CONTACT_RATE_LIMIT_MAX,
    CONTACT_RATE_LIMIT_WINDOW_MS: process.env.CONTACT_RATE_LIMIT_WINDOW_MS,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
  }

  return parsed.data;
}

export const env = loadEnv();

/**
 * `.env` / `.env.local` are gitignored and never reach Vercel, so
 * `NEXT_PUBLIC_SITE_URL` on a real deploy comes only from the dashboard's
 * Environment Variables. If it's unset there, the zod default above falls
 * back to localhost silently — the sitemap, canonical URLs, OG tags, and
 * JSON-LD would all point at localhost with no build error. Fail loudly
 * on an actual Vercel production build instead of shipping that quietly.
 */
if (process.env.VERCEL_ENV === 'production' && /^https?:\/\/localhost/.test(env.NEXT_PUBLIC_SITE_URL)) {
  throw new Error(
    'NEXT_PUBLIC_SITE_URL is unset or points at localhost on a Vercel production build. ' +
      'Set it to https://jackalloussi.online in Project Settings → Environment Variables (Production).',
  );
}
