'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactFormSchema, type ContactFormInput } from '@/content/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

type FormStatus = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle' });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
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
        setStatus({ kind: 'error', message: payload.error ?? 'Something went wrong. Please email me directly.' });
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
      className="space-y-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6"
      noValidate
    >
      <Input label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Subject"
        autoComplete="off"
        error={errors.subject?.message}
        {...register('subject')}
      />
      <Textarea label="Message" error={errors.message?.message} {...register('message')} />

      {/* Honeypot — hidden from users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
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
