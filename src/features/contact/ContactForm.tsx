'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import type { ContactFormInput } from '@/content/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

type FormStatus = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; code: string };

/** Error codes returned by `/api/contact`; anything else falls back to `generic`. */
const API_ERROR_CODES = [
  'rate_limited',
  'invalid_json',
  'validation_failed',
  'unavailable',
  'misconfigured',
  'send_failed',
] as const;
type ApiErrorCode = (typeof API_ERROR_CODES)[number];

const CONTACT_EMAIL = 'jackalloussi23@gmail.com';

// Mirrors contactFormSchema in @/content/schemas. The server route
// re-validates with the real zod schema — this is only for instant client
// feedback, and duplicating the rules here (rather than pulling zodResolver
// into the browser) keeps zod off the client entirely: it was a 287KB chunk
// that Next's chunk-sharing heuristic loaded on every page, not just this
// one, since it's linked to from the header, footer, and floating CTA.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const t = useTranslations('contactForm');
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle' });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      website: '',
    },
  });

  async function onSubmit(values: ContactFormInput) {
    setStatus({ kind: 'idle' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setStatus({ kind: 'error', code: payload.error ?? 'generic' });
        return;
      }

      reset();
      setStatus({ kind: 'success' });
    } catch {
      setStatus({ kind: 'error', code: 'network' });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative z-10 space-y-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 shadow-[var(--shadow-md)] sm:p-6"
      noValidate
    >
      <Input
        label={t('name')}
        autoComplete="name"
        placeholder={t('namePlaceholder')}
        error={errors.name?.message}
        {...register('name', {
          required: t('validation.nameRequired'),
          minLength: { value: 2, message: t('validation.nameMin') },
          maxLength: { value: 100, message: t('validation.nameMax') },
        })}
      />
      <Input
        label={t('email')}
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder={t('emailPlaceholder')}
        error={errors.email?.message}
        {...register('email', {
          required: t('validation.emailRequired'),
          pattern: { value: EMAIL_PATTERN, message: t('validation.emailInvalid') },
        })}
      />
      <Input
        label={t('subject')}
        autoComplete="off"
        placeholder={t('subjectPlaceholder')}
        error={errors.subject?.message}
        {...register('subject', {
          required: t('validation.subjectRequired'),
          minLength: { value: 3, message: t('validation.subjectMin') },
          maxLength: { value: 120, message: t('validation.subjectMax') },
        })}
      />
      <Textarea
        label={t('message')}
        placeholder={t('messagePlaceholder')}
        error={errors.message?.message}
        {...register('message', {
          required: t('validation.messageRequired'),
          minLength: { value: 20, message: t('validation.messageMin') },
          maxLength: { value: 5000, message: t('validation.messageMax') },
        })}
      />

      <div className="pointer-events-none absolute start-0 top-0 h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor="website">{t('honeypot')}</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div aria-live="polite" className="min-h-6 text-[var(--text-sm)]">
        {status.kind === 'success' ? (
          <p className="text-[var(--color-success)]">{t('success')}</p>
        ) : null}
        {status.kind === 'error' ? (
          <p className="text-[var(--color-danger)]">
            {(API_ERROR_CODES as readonly string[]).includes(status.code)
              ? t(`errors.${status.code as ApiErrorCode}`, { email: CONTACT_EMAIL })
              : status.code === 'network'
                ? t('errors.network', { email: CONTACT_EMAIL })
                : t('errors.generic')}
          </p>
        ) : null}
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? t('sending') : t('send')}
      </Button>
    </form>
  );
}
