'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { ContactFormInput } from '@/content/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

type FormStatus = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; message: string };

// Mirrors contactFormSchema in @/content/schemas. The server route
// re-validates with the real zod schema — this is only for instant client
// feedback, and duplicating the rules here (rather than pulling zodResolver
// into the browser) keeps zod off the client entirely: it was a 287KB chunk
// that Next's chunk-sharing heuristic loaded on every page, not just this
// one, since it's linked to from the header, footer, and floating CTA.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
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
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus({
          kind: 'error',
          message: payload.error ?? 'Something went wrong. Please email me directly.',
        });
        return;
      }

      reset();
      setStatus({ kind: 'success' });
    } catch {
      setStatus({
        kind: 'error',
        message: 'Network error. Please email jackalloussi23@gmail.com instead.',
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative z-10 space-y-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 shadow-[var(--shadow-md)] sm:p-6"
      noValidate
    >
      <Input
        label="Name"
        autoComplete="name"
        placeholder="Your name"
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
          maxLength: { value: 100, message: 'Name must be 100 characters or fewer' },
        })}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@company.com"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
        })}
      />
      <Input
        label="Subject"
        autoComplete="off"
        placeholder="Role, intro call, or question"
        error={errors.subject?.message}
        {...register('subject', {
          required: 'Subject is required',
          minLength: { value: 3, message: 'Subject must be at least 3 characters' },
          maxLength: { value: 120, message: 'Subject must be 120 characters or fewer' },
        })}
      />
      <Textarea
        label="Message"
        placeholder="A short note about the role or what you’d like to discuss…"
        error={errors.message?.message}
        {...register('message', {
          required: 'Message is required',
          minLength: { value: 20, message: 'Message must be at least 20 characters' },
          maxLength: { value: 5000, message: 'Message must be 5000 characters or fewer' },
        })}
      />

      <div className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div aria-live="polite" className="min-h-6 text-[var(--text-sm)]">
        {status.kind === 'success' ? (
          <p className="text-[var(--color-success)]">Message sent. I will get back to you soon.</p>
        ) : null}
        {status.kind === 'error' ? (
          <p className="text-[var(--color-danger)]">{status.message}</p>
        ) : null}
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
