import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsPreviewSection } from '@/components/sections/ProjectsPreviewSection';
import { ExperiencePreviewSection } from '@/components/sections/ExperiencePreviewSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsPreviewSection />
      <ExperiencePreviewSection />
      <EducationSection />
      <ContactSection />
    </>
  );
}
