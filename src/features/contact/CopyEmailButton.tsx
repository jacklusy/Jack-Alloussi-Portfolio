'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export type CopyEmailButtonProps = {
  email: string;
};

export function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleCopy} aria-live="polite">
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}
