import type { Metadata } from 'next';
import { ContactSection } from '@/components/sections/ContactSection';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Jack Alloussi — email, phone, LinkedIn, and availability for EU Blue Card–eligible relocation to Germany.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactSection />;
}
