import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsPreviewSection } from '@/components/sections/ProjectsPreviewSection';
import { ExperiencePreviewSection } from '@/components/sections/ExperiencePreviewSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { SectionRail } from '@/components/motion/SectionRail';
import { TechRibbon } from '@/components/motion/TechRibbon';
import { getTopTechnologies } from '@/content';
import { routing } from '@/i18n/routing';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <SectionRail />
      <HeroSection locale={locale} />
      <AboutSection locale={locale} />
      <TechRibbon items={getTopTechnologies(8)} />
      <SkillsSection locale={locale} />
      <ProjectsPreviewSection locale={locale} />
      <ExperiencePreviewSection locale={locale} />
      <EducationSection locale={locale} />
      <ContactSection locale={locale} />
    </>
  );
}
